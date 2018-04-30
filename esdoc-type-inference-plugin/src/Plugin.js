const ASTNodeContainer = require('esdoc/out/src/Util/ASTNodeContainer.js').default;
const ASTUtil = require('esdoc/out/src/Util/ASTUtil').default;

class Plugin {
  onHandleDocs(ev) {
    this._docs = ev.data.docs;
    this._option = ev.data.option || {};

    if (!('enable' in this._option)) this._option.enable = true;

    this._exec();
  }

  _exec() {
    if (!this._option.enable) return this._docs;

    this._inferenceMethod();
    this._inferenceFunction();
    this._inferenceGetter();
    this._inferenceSetter();
    this._inferenceMember();
    this._inferenceVariable();
  }

  _inferenceMethod() {
    const docs = this._docs.filter((doc) => doc.kind === 'method');

    for (const doc of docs) {
      const node = ASTNodeContainer.getNode(doc.__docId__);
      if (!doc.params) doc.params = this._inferenceParam(node);
      if (!doc.return) doc.return = this._inferenceReturn(node);
    }
  }

  _inferenceFunction() {
    const docs = this._docs.filter((doc) => doc.kind === 'function');

    for (const doc of docs) {
      const node = ASTNodeContainer.getNode(doc.__docId__);
      if (!doc.params) doc.params = this._inferenceParam(node);
      if (!doc.return) doc.return = this._inferenceReturn(node);
    }
  }

  _inferenceGetter() {
    const docs = this._docs.filter((doc) => doc.kind === 'get');

    for (const doc of docs) {
      const node = ASTNodeContainer.getNode(doc.__docId__);
      if (!doc.type) doc.type = this._inferenceReturn(node);
    }
  }

  _inferenceSetter() {
    // todo: infer setter is not working. please implement inference.
    // const docs = this._docs.filter((doc) => doc.kind === 'set');
    //
    // for (const doc of docs) {
    //   const node = ASTNodeContainer.getNode(doc.__docId__);
    //   if (!doc.type) doc.type = this._inferenceType(node.right);
    // }
  }

  _inferenceMember() {
    const docs = this._docs.filter((doc) => doc.kind === 'member');

    for (const doc of docs) {
      const node = ASTNodeContainer.getNode(doc.__docId__);
      if (!doc.type) doc.type = this._inferenceType(node.right);
    }
  }

  _inferenceVariable() {
    const docs = this._docs.filter((doc) => doc.kind === 'variable');

    for (const doc of docs) {
      if (doc.type) continue;

      const node = ASTNodeContainer.getNode(doc.__docId__);

      let className;

      // e.g. `export default foo = new Foo();`
      if (node.type === 'AssignmentExpression') {
        if (node.right && node.right.type === 'NewExpression') {
          className = node.right.callee.name;
        } else {
          doc.type = this._inferenceType(node.right);
          continue;
        }
      }

      // e.g. `let foo = new Foo();`
      if (node.type === 'VariableDeclaration') {
        if (node.declarations[0].init.type === 'NewExpression') {
          className = node.declarations[0].init.callee.name;
        } else {
          doc.type = this._inferenceType(node.declarations[0].init);
          continue;
        }
      }

      // can not infer className
      if (!className) {
        doc.type = {types: ['*']};
        continue;
      }

      if (className) {
        // infer from same file.
        const classDoc = this._docs.find((_doc) =>{
          if (_doc.kind === 'class' && _doc.memberof === doc.memberof && _doc.name === className) {
            return true;
          }
        });
        if (classDoc) {
          doc.type = {types: [classDoc.longname]};
          continue;
        }

        // ambiguous infer from other file
        const ambiguousClassDocs = this._docs.filter((_doc) => {
          if (_doc.kind === 'class' && _doc.name === className) {
            return true;
          }
        });
        if (ambiguousClassDocs.length === 1) {
          doc.type = {types: [ambiguousClassDocs[0].longname]};
          continue;
        }

        // can not infer
        doc.type = {types: ['*']};
      } else {
        doc.type = {types: ['*']};
      }
    }
  }

  _inferenceParam(node) {
    const params = node.params;
    const _params = [];
    for (let i = 0; i < params.length; i++) {
      const param = params[i];
      const result = {};

      switch (param.type) {
        case 'Identifier':
          // e.g. func(a){}
          result.name = param.name;
          result.types = ['*'];
          break;

        case 'AssignmentPattern':
          if (param.left.type === 'Identifier') {
            result.name = param.left.name;
          } else if (param.left.type === 'ObjectPattern') {
            result.name = `objectPattern${i === 0 ? '' : i}`;
          } else if (param.left.type === 'ArrayPattern') {
            result.name = `arrayPattern${i === 0 ? '' : i}`;
          }

          result.optional = true;

          if (param.right.type.includes('Literal')) {
            // e.g. func(a = 10){}
            result.types = param.right.value === null ? ['*'] : [typeof param.right.value];
            result.defaultRaw = param.right.value;
            result.defaultValue = `${result.defaultRaw}`;
          } else if (param.right.type === 'ArrayExpression') {
            // e.g. func(a = [123]){}
            result.types = param.right.elements.length ? [`${typeof param.right.elements[0].value}[]`] : ['*[]'];
            result.defaultRaw = param.right.elements.map((elm)=> elm.value);
            result.defaultValue = `${JSON.stringify(result.defaultRaw)}`;
          } else if (param.right.type === 'ObjectExpression') {
            const typeMap = {};
            for (const prop of param.left.properties || []) {
              typeMap[prop.key.name] = '*';
            }

            // e.g. func(a = {key: 123}){}
            const obj = {};
            for (const prop of param.right.properties) {
              obj[prop.key.name] = prop.value.value;
              typeMap[prop.key.name] = typeof prop.value.value;
            }

            const types = [];
            for (const key of Object.keys(typeMap)) {
              types.push(`"${key}": ${typeMap[key]}`);
            }

            result.types = [`{${types.join(', ')}}`];
            result.defaultRaw = obj;
            result.defaultValue = `${JSON.stringify(result.defaultRaw)}`;
          } else if (param.right.type === 'Identifier') {
            // e.g. func(a = value){}
            result.types = ['*'];
            result.defaultRaw = param.right.name;
            result.defaultValue = `${param.right.name}`;
          } else {
            // e.g. func(a = new Foo()){}, func(a = foo()){}
            // CallExpression, NewExpression
            result.types = ['*'];
          }
          break;
        case 'RestElement':
          // e.g. func(...a){}
          result.name = `${param.argument.name}`;
          result.types = ['...*'];
          result.spread = true;
          break;
        case 'ObjectPattern': {
          const objectPattern = [];
          const raw = {};
          for (const property of param.properties) {
            if (property.type === 'ObjectProperty') {
              objectPattern.push(`"${property.key.name}": *`);
              raw[property.key.name] = null;
            } else if (property.type === 'RestProperty') {
              objectPattern.push(`...${property.argument.name}: Object`);
              raw[property.argument.name] = {};
            }
          }
          result.name = `objectPattern${i === 0 ? '' : i}`;
          result.types = [`{${objectPattern.join(', ')}}`];
          result.defaultRaw = raw;
          result.defaultValue = `${JSON.stringify(result.defaultRaw)}`;
          break;
        }
        case 'ArrayPattern': {
          // e.g. func([a, b = 10]){}
          let arrayType = null;
          const raw = [];

          for (const element of param.elements) {
            if (!element) { // case `function([, v]){}
              raw.push('undefined');
            } else if (element.type === 'Identifier') {
              raw.push('null');
            } else if (element.type === 'AssignmentPattern') {
              if ('value' in element.right) {
                if (!arrayType && element.right.value !== null) arrayType = typeof element.right.value;
                raw.push(JSON.stringify(element.right.value));
              } else {
                raw.push('*');
              }
            }
          }

          if (!arrayType) arrayType = '*';
          result.name = `arrayPattern${i === 0 ? '' : i}`;
          result.types = [`${arrayType}[]`];
          result.defaultRaw = raw;
          result.defaultValue = `[${raw.join(', ')}]`;
          break;
        }
        default:
          logger.w('unknown param.type', param);
      }

      _params.push(result);
    }

    return _params;
  }

  _inferenceReturn(node) {
    const body = node.body;
    const result = {};
    const inferenceType = this._inferenceType.bind(this);

    ASTUtil.traverse(body, (node, parent, path)=>{
      // `return` in Function is not the body's `return`
      if (node.type.includes('Function')) {
        path.skip();
        return;
      }

      if (node.type !== 'ReturnStatement') return;

      if (!node.argument) return;

      result.types = inferenceType(node.argument).types;
    });

    if (result.types) {
      return result;
    }

    return null;
  }

  _inferenceType(right) {
    if (!right) {
      return {types: ['*']};
    }

    if (right.type === 'TemplateLiteral') {
      return {types: ['string']};
    }

    if (right.type === 'NullLiteral') {
      return {types: ['*']};
    }

    if (right.type.includes('Literal')) {
      return {types: [typeof right.value]};
    }

    if (right.type === 'ArrayExpression') {
      if (right.elements.length) {
        return {types: [`${typeof right.elements[0].value}[]`]};
      } else {
        return {types: ['*[]']};
      }
    }

    if (right.type === 'ObjectExpression') {
      const typeMap = {};
      for (const prop of right.properties) {
        switch (prop.type) {
          case 'ObjectProperty': {
            const name = `"${prop.key.name || prop.key.value}"`;
            typeMap[name] = prop.value.value ? typeof prop.value.value : '*';
            break;
          }
          case 'ObjectMethod': {
            const name = `"${prop.key.name || prop.key.value}"`;
            typeMap[name] = 'function';
            break;
          }
          case 'SpreadProperty': {
            const name = `...${prop.argument.name}`;
            typeMap[name] = 'Object';
            break;
          }
          default: {
            const name = `"${prop.key.name || prop.key.value}"`;
            typeMap[name] = '*';
          }
        }
      }

      const types = [];
      for (const key of Object.keys(typeMap)) {
        types.push(`${key}: ${typeMap[key]}`);
      }

      return {types: [`{${types.join(', ')}}`]};
    }

    return {types: ['*']};
  }
}

module.exports = new Plugin();
