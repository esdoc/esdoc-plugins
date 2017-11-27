const path = require('path');
const ts = require('typescript');
const CommentParser = require('esdoc/out/src/Parser/CommentParser').default;

class Plugin {
  constructor() {
    this._enable = true;
  }

  onStart(ev) {
    if (!ev.data.option) return;
    if ('enable' in ev.data.option) this._enable = ev.data.option.enable;
  }

  onHandleConfig(ev) {
    if (!this._enable) return;

    if (!ev.data.config.includes)  ev.data.config.includes = [];
    ev.data.config.includes.push('\\.ts$', '\\.js$');
  }

  onHandleCodeParser(ev) {
    if (!this._enable) return;

    const esParser = ev.data.parser;
    const esParserOption = ev.data.parserOption;
    const filePath = ev.data.filePath;

    // ev.data.parser = this._tsParser.bind(this, esParser, esParserOption, filePath);

    ev.data.parser = (code) =>{
      try {
        return this._tsParser(esParser, esParserOption, filePath, code);
      } catch(e) {
        console.log(e)
      }
    };
  }

  // https://github.com/Microsoft/TypeScript/blob/master/src/services/transpile.ts#L26
  _tsParser(esParser, esParserOption, filePath, code) {
    // return if not typescript
    if (path.extname(filePath) !== '.ts') return esParser(code);

    // create ast and get target nodes
    const sourceFile = ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true);
    const nodes = this._getTargetTSNodes(sourceFile);

    // rewrite jsdoc comment
    nodes.sort((a,b) => b.pos - a.pos); // hack: transpile comment with reverse
    const codeChars = [...code];
    for (const node of nodes) {
      const jsDocNode = this._getJSDocNode( node);
      if (jsDocNode && jsDocNode.comment) codeChars.splice(jsDocNode.pos, jsDocNode.end - jsDocNode.pos);

      const newComment = this._transpileComment(node, jsDocNode ? jsDocNode.comment : '', code);
      codeChars.splice(node.pos, 0, newComment);
    }
    const newTSCode = codeChars.join('');

    // transpile typescript to es
    const esCode = this._transpileTS2ES(newTSCode);

    return esParser(esCode);
  }

  _getTargetTSNodes(sourceFile) {
    const nodes = [];
    walk(sourceFile);
    return nodes;

    function walk(node) {
      switch (node.kind) {
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.PropertyDeclaration:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
        case ts.SyntaxKind.FunctionDeclaration:
          nodes.push(node);
          break;
      }

      ts.forEachChild(node, walk);
    }
  }

  _getJSDocNode(node) {
    if (!node.jsDoc) return null;

    return node.jsDoc[node.jsDoc.length - 1];
  }

  _transpileComment(node, comment, code) {
    const esNode = {type: 'CommentBlock', value: `*\n${comment}`};
    const tags = CommentParser.parse(esNode);

    this._applyLOC(node, tags, code);

    switch(node.kind) {
      case ts.SyntaxKind.ClassDeclaration:
        // do nothing
        break;
      case ts.SyntaxKind.MethodDeclaration:
        this._applyCallableParam(node, tags);
        this._applyCallableReturn(node, tags);
        break;
      case ts.SyntaxKind.PropertyDeclaration:
        this._applyClassProperty(node, tags);
        break;
      case ts.SyntaxKind.GetAccessor:
        this._applyClassMethodGetter(node, tags);
        break;
      case ts.SyntaxKind.SetAccessor:
        this._applyClassMethodSetter(node, tags);
        break;
      case ts.SyntaxKind.FunctionDeclaration:
        this._applyCallableParam(node, tags);
        this._applyCallableReturn(node, tags);
        break;
    }

    return `\n/*${CommentParser.buildComment(tags)} */\n`;
  }

  _applyLOC(node, tags, code) {
    let loc = 1;
    const codeChars = [...code];
    for (let i = 0; i < node.name.end; i++) {
      if (codeChars[i] === '\n') loc++;
    }
    tags.push({tagName: '@lineNumber', tagValue: `${loc}`});
  }

  _applyCallableParam(node, tags) {
    const types = node.parameters.map(param => {
      return {
        type: this._getTypeFromAnnotation(param.type),
        name: param.name.text
      };
    });

    const paramTags = tags.filter(tag => tag.tagName === '@param');

    // merge
    // case: params without comments
    if (paramTags.length === 0 && types.length) {
      const tmp = types.map(({type, name}) => {
        return {
          tagName: '@param',
          tagValue: `{${type}} ${name}`
        };
      });
      tags.push(...tmp);
      return;
    }

    // case: params with comments
    if (paramTags.length === types.length) {
      for (let i = 0; i < paramTags.length; i++) {
        const paramTag = paramTags[i];
        const type = types[i];
        if (paramTag.tagValue.charAt(0) !== '{') { // does not have type
          paramTag.tagValue = `{${type.type}} ${paramTag.tagValue}`;
        }
      }
      return;
    }

    // case: mismatch params and comments
    throw new Error('mismatch params and comments');
  }

  _applyCallableReturn(node, tags) {
    if (!node.type) return;

    // get type
    const type = this._getTypeFromAnnotation(node.type);
    if (!type) return;

    // get comments
    const returnTag = tags.find(tag => tag.tagName === '@return' || tag.tagName === '@returns');

    // merge
    if (returnTag && returnTag.tagValue.charAt(0) !== '{') { // return with comment but does not have type
      returnTag.tagValue = `{${type}} ${returnTag.tagValue}`;
    } else {
      tags.push({tagName: '@return', tagValue: `{${type}}`});
    }
  }

  _applyClassMethodGetter(node, tags) {
    if (!node.type) return;

    // get type
    const type = this._getTypeFromAnnotation(node.type);
    if (!type) return;

    // get comments
    const typeComment = tags.find(tag => tag.tagName === '@type');

    if (typeComment && typeComment.tagValue.charAt(0) !== '{') { // type with comment but does not have tpe
      typeComment.tagValue = `{${type}}`;
    } else {
      tags.push({tagName: '@type', tagValue: `{${type}}`});
    }
  }

  _applyClassMethodSetter(node, tags) {
    if (!node.parameters) return;

    // get type
    const type = this._getTypeFromAnnotation(node.parameters[0].type);
    if (!type) return;

    // get comment
    const typeComment = tags.find(tag => tag.tagName === '@type');
    if (typeComment) return;

    // merge
    // case: param without comment
    tags.push({tagName: '@type', tagValue: `{${type}}`});
  }

  _applyClassProperty(node, tags) {
    if (!node.type) return;

    // get type
    const type = this._getTypeFromAnnotation(node.type);
    if (!type) return;

    // get comments
    const typeComment = tags.find(tag => tag.tagName === '@type');

    if (typeComment && typeComment.tagValue.charAt(0) !== '{') { // type with comment but does not have tpe
      typeComment.tagValue = `{${type}}`;
    } else {
      tags.push({tagName: '@type', tagValue: `{${type}}`});
    }
  }

  _getTypeFromAnnotation(typeNode) {
    if (!typeNode) {
      return 'undefined';
    }

    switch(typeNode.kind) {
      case ts.SyntaxKind.NumberKeyword: return 'number';
      case ts.SyntaxKind.StringKeyword: return 'string';
      case ts.SyntaxKind.BooleanKeyword: return 'boolean';
      case ts.SyntaxKind.TypeReference: return typeNode.typeName.text;
    }
  }

  _transpileTS2ES(tsCode) {
    // todo
    const esOption = {
      decorators: true,
      jsx: true,
    };
    const options = {
      module: ts.ModuleKind.ES2015,
      noResolve: true,
      target: ts.ScriptTarget.Latest,
      experimentalDecorators: esOption.decorators,
      jsx: esOption.jsx ? 'preserve' : undefined,
    };

    const result = ts.transpileModule(tsCode, {compilerOptions: options});
    return result.outputText;
  }
}

module.exports = new Plugin();
