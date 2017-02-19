const fs = require('fs-extra');
const path = require('path');

class ExternalECMAScriptPlugin {
  constructor(config, option) {
    this._config = config;
    this._option = option;

    if (!('enable' in this._option)) this._option.enable = true;
  }

  exec(){
    if (!this._option.enable) return;

    const srcPath = path.resolve(__dirname, 'external-ecmascript.js');
    const outPath = path.resolve(this._config.source, '.external-ecmascript.js');

    fs.copySync(srcPath, outPath);
  }

  cleanup(tags){
    if (!this._option.enable) return;

    const outPath = path.resolve(this._config.source, '.external-ecmascript.js');
    fs.removeSync(outPath);

    const name = path.basename(path.resolve(this._config.source)) + '/.external-ecmascript.js';
    for (const tag of tags) {
      if (tag.kind === 'external' && tag.memberof === name) tag.builtinExternal = true;
    }

    const tagIndex = tags.findIndex(tag => tag.kind === 'file' && tag.name === name);
    tags.splice(tagIndex, 1);
  }
}

module.exports = ExternalECMAScriptPlugin;

