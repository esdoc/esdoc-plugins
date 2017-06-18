const AbstractBuilder = require('./AbstractBuilder');
const IceCap = require('ice-cap').default;

class FunctionBuilder extends AbstractBuilder {
  makeHTML() {
    const docs = this._docs.filter(doc => doc.kind === 'function');
    const outputs = [];

    for (const doc of docs) {
      const ice = new IceCap(this._readTemplate('function.html'));
      this._applyBody(doc, ice);
      this._applyParam(doc, ice);
      outputs.push(ice.html);
    }

    return outputs.join('\n');
  }

  _applyBody(doc, ice) {
    ice.text('functionName', this._makeSignature(doc));
    ice.text('functionDesc', doc.description);
  }

  _applyParam(doc, ice) {
    const params = doc.params || [];
    ice.loop('functionParam', params, (index, param, ice) =>{
      ice.text('name', param.name);
      ice.text('type', param.types.join('|'));
      ice.text('attribute', this._makeParamAttribute(param) || ' ');
      ice.text('desc', param.description);
    });
  }
}

module.exports = FunctionBuilder;
