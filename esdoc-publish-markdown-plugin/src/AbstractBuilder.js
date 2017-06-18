const path = require('path');
const fs = require('fs');

class AbstractBuilder {
  constructor(docs) {
    this._docs = docs;
  }

  makeHTML() {
    return '';
  }

  _findAll(cond = {}) {
    const keys = Object.keys(cond);
    return this._docs.filter((doc) =>{
      for (const key of keys) if (doc[key] !== cond[key]) return false;
      return true;
    });
  }

  _find(cond = {}) {
    return this._findAll(cond)[0];
  }

  _makeSignature(doc) {
    if (['constructor', 'method', 'function'].includes(doc.kind)) {
      let params = [];
      if (doc.params) params = doc.params.map(param => `${param.name}: ${param.types.join('|')}`);
      const type = doc.return ? `: ${doc.return.types.join('|')}` : '';
      return `\`${doc.name}(${params.join(', ')})${type}\``;
    }

    if (['member', 'variable'].includes(doc.kind)) {
      const type = doc.type ? doc.type.types.join('|') : '*';
      return `\`${doc.name}: ${type}\``;
    }
  }

  _makeParamAttribute(param) {
    const attrs = [];
    if (param.nullable !== null) attrs.push(`nullable: ${param.nullable}`);
    if (param.optional) attrs.push('optional: true');
    if (param.defaultValue) attrs.push(`default: ${param.defaultValue}`);

    return attrs.join(', ');
  }

  _readTemplate(fileName) {
    const filePath = path.resolve(__dirname, `./template/${fileName}`);
    return fs.readFileSync(filePath, {encoding: 'utf-8'});
  }
}

module.exports = AbstractBuilder;
