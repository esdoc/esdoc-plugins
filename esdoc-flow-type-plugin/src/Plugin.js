const ASTUtil = require('esdoc/out/src/Util/ASTUtil').default;
const CommentParser = require('esdoc/out/src/Parser/CommentParser').default;
const InvalidCodeLogger = require('esdoc/out/src/Util/InvalidCodeLogger').default;

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
      return {
        type: this._getTypeFromAnnotation(param.typeAnnotation),
        name: param.name
      }
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

      commentNode.value = CommentParser.buildComment(tags);
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

    if (typeComment && typeComment.tagValue.charAt(0) !== '{') { // type with comment but does not have tpe
      typeComment.tagValue = `{${type}}`;
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

    if (typeComment && typeComment.tagValue.charAt(0) !== '{') { // type with comment but does not have tpe
      typeComment.tagValue = `{${type}}`;
    } else {
      tags.push({tagName: '@type', tagValue: `{${type}}`});
    }

    commentNode.value = CommentParser.buildComment(tags);
  }

  _getTypeFromAnnotation(typeAnnotation) {
    if (!typeAnnotation) return '*';

    let type;
    switch (typeAnnotation.typeAnnotation.type) {
      case 'GenericTypeAnnotation':
        type = typeAnnotation.typeAnnotation.id.name;
        break;
      default:
        type = typeAnnotation.typeAnnotation.type.replace('TypeAnnotation', '').toLowerCase();
        break;
    }

    return type;
  }
}

module.exports = new FlowTypePlugin();
