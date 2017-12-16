const ASTUtil = require('esdoc/out/src/Util/ASTUtil').default;
const CommentParser = require('esdoc/out/src/Parser/CommentParser').default;
const InvalidCodeLogger = require('esdoc/out/src/Util/InvalidCodeLogger').default;

function formatExpression(expr) {
  switch (expr.type) {
  case 'ObjectExpression':
    return `{${expr.properties.map(formatExpression)}}`;
  default: // XLiteral
    return expr.value ? String(expr.value) : undefined;
  }
}

function formatTypeId(id) {
  switch (id.type) {
  case 'QualifiedTypeIdentifier':
    return `${formatTypeId(id.qualification)}.${formatTypeId(id.id)}`;
  case 'Identifier':
    return id.name;
  default:
    return id.type;
  }
}

function isOptional(type) {
  // TODO: should detect 'foo | void' here as well...
  return type.type === 'NullableTypeAnnotation';
}

function formatTypeAnnotation(type) {
  switch (type.type) {
  case 'GenericTypeAnnotation':
    return type.typeParameters ?
      `${formatTypeId(type.id)}<${formatTypeAnnotations(type.typeParameters.params, ', ')}>` :
      formatTypeId(type.id);
  case 'TupleTypeAnnotation':
    return `[${formatTypeAnnotations(type.types, ', ')}]`;
  case 'NullableTypeAnnotation':
    return `?${formatTypeAnnotation(type.typeAnnotation)}`;
  case 'UnionTypeAnnotation':
    return formatTypeAnnotations(type.types, '|');
  case 'ArrayTypeAnnotation':
    return `${formatTypeAnnotation(type.elementType)}[]`;
  default:
    return type.type.replace('TypeAnnotation', '').toLowerCase();
  }
}

function formatTypeAnnotations(types, sep) {
  return types.map(formatTypeAnnotation).join(sep);
}

class FlowTypePlugin {
  constructor() {
    this._enable = true;
  }

  onStart(ev) {
    if (!ev.data.option) return;
    if ('enable' in ev.data.option) this._enable = ev.data.option.enable;
  }

  onHandleCodeParser(ev) {
    if (this._enable) ev.data.parserOption.plugins.push('flow');
  }

  onHandleAST(ev) {
    if (!this._enable) return;

    ASTUtil.traverse(ev.data.ast, (node, parent, path) =>{
      try {
        this._dispatch(node, parent, path);
      } catch (e) {
        console.log(`[31m${e.message}[0m`);
        InvalidCodeLogger.show(ev.data.filePath, node);
      }
    });
  }

  _dispatch(node, parent, path) {
    switch (node.type) {
      case 'ClassMethod':
        switch (node.kind) {
          case 'constructor':
            this._applyCallableParam(node);
            break;
          case 'method':
            this._applyCallableParam(node);
            this._applyCallableReturn(node);
            break;
          case 'get':
            this._applyClassMethodGetter(node);
            break;
          case 'set':
            this._applyClassMethodSetter(node);
            break;
          default:
            console.warn(`Unknown ClassMethod kind: ${node.kind}`);
            break;
        }
        break;
      case 'ClassProperty':
        this._applyClassProperty(node);
        break;
      case 'FunctionDeclaration':
        this._applyCallableParam(node);
        this._applyCallableReturn(node);
        break;
    }
  }

  _applyCallableParam(node) {
    if (!node.params) return;

    // get comments
    const {tags, commentNode} = CommentParser.parseFromNode(node);

    // get types
    const types = node.params.map(param => {
      switch (param.type) {
      case 'Identifier':
        return {
          type: this._getTypeFromAnnotation(param.typeAnnotation),
          name: param.name,
          tagName: param.typeAnnotation && isOptional(param.typeAnnotation) ?
            `[${param.name}]` : param.name,
        };
      case 'AssignmentPattern':
        return {
          type: this._getTypeFromAnnotation(param.left.typeAnnotation),
          name: param.name,
          tagName: `[${param.left.name}=${formatExpression(param.right)}]`,
        };
      case 'RestElement':
        return {
          type: `...${this._getTypeFromAnnotation(param.typeAnnotation)}`,
          name: param.argument.name,
          tagName: param.argument.name,
        };
      default:
        console.warn(`Unhandled method parameter type: ${param.type}`);
        console.dir(param);
        return {
          type: '*',
          name: param.name,
          tagName: param.name,
        };
      }
    });
    const paramTags = tags.filter(tag => tag.tagName === '@param');

    // merge
    // case: params without comments
    if (paramTags.length === 0 && types.length) {
      const tmp = types.map(({type, tagName}) => {
        return {
          tagName: '@param',
          tagValue: `{${type}} ${tagName}`
        };
      });
      tags.push(...tmp);

      commentNode.value = CommentParser.buildComment(tags);
      return;
    }

    // case: params with comments
    if (paramTags.length === types.length) {
      for (let i = 0; i < paramTags.length; i++) {
        const paramTag = paramTags[i];
        const type = types[i];
        let text = paramTag.tagValue;
        if (text.charAt(0) !== '{') { // does not have type
          if (text.charAt(0) !== '[') { // does not have attrs
            text = `${type.tagName} ${text.substring(text.indexOf(' ')+1)}`;
          }
          paramTag.tagValue = `{${type.type}} ${text}`;
        }
      }

      commentNode.value = CommentParser.buildComment(tags);
      return;
    }

    // case: mismatch params and comments
    throw new Error('mismatch params and comments');
  }

  _applyCallableReturn(node) {
    if (!node.returnType) return;

    // get type
    const type = this._getTypeFromAnnotation(node.returnType);
    if (!type) return;

    // get comments
    const {tags, commentNode} = CommentParser.parseFromNode(node);
    const returnTag = tags.find(tag => tag.tagName === '@return' || tag.tagName === '@returns');

    // merge
    if (returnTag) {
      if (returnTag.tagValue.charAt(0) !== '{') { // return with comment but does not have tpe
        returnTag.tagValue = `{${type}} ${returnTag.tagValue}`;
      }
      // otherwise @return already has type annotation, leave as is
    } else {
      tags.push({tagName: '@return', tagValue: `{${type}}`});
    }

    commentNode.value = CommentParser.buildComment(tags);
  }

  _applyClassMethodGetter(classMethodNode) {
    if (classMethodNode.kind !== 'get') return;
    if (!classMethodNode.returnType) return;

    // get type
    const type = this._getTypeFromAnnotation(classMethodNode.returnType);
    if (!type) return;

    // get comments
    const {tags, commentNode} = CommentParser.parseFromNode(classMethodNode);
    const typeComment = tags.find(tag => tag.tagName === '@type');

    if (typeComment) {
      if (typeComment.tagValue.charAt(0) !== '{') { // type with comment but does not have tpe
        typeComment.tagValue = `{${type}}`;
      }
      // otherwise getter already has type annotation, leave as is
    } else {
      tags.push({tagName: '@type', tagValue: `{${type}}`});
    }

    commentNode.value = CommentParser.buildComment(tags);
  }

  _applyClassMethodSetter(classMethodNode) {
    if (classMethodNode.kind !== 'set') return;
    if (!classMethodNode.params) return;

    // get type
    const type = this._getTypeFromAnnotation(classMethodNode.params[0].typeAnnotation);
    if (!type) return;

    // get comment
    const {tags, commentNode} = CommentParser.parseFromNode(classMethodNode);
    const typeComment = tags.find(tag => tag.tagName === '@type');
    if (typeComment) return;

    // merge
    // case: param without comment
    tags.push({tagName: '@type', tagValue: `{${type}}`});
    commentNode.value = CommentParser.buildComment(tags);
  }

  _applyClassProperty(classPropertyNode) {
    if (!classPropertyNode.typeAnnotation) return;

    // get type
    const type = this._getTypeFromAnnotation(classPropertyNode.typeAnnotation);
    if (!type) return;

    // get comments
    const {tags, commentNode} = CommentParser.parseFromNode(classPropertyNode);
    const typeComment = tags.find(tag => tag.tagName === '@type');

    if (typeComment) {
      if (typeComment.tagValue.charAt(0) !== '{') { // type with comment but does not have tpe
        typeComment.tagValue = `{${type}}`;
      }
      // otherwise property already has type annotation, leave as is
    } else {
      tags.push({tagName: '@type', tagValue: `{${type}}`});
    }

    commentNode.value = CommentParser.buildComment(tags);
  }

  _getTypeFromAnnotation(typeAnnotation) {
    if (!typeAnnotation) return '*';

    return formatTypeAnnotation(typeAnnotation.typeAnnotation);
  }
}

module.exports = new FlowTypePlugin();
