const path = require('path');
const ts = require('typescript');
const CommentParser = require('@sebastianwessel/esdoc/out/src/Parser/CommentParser').default;

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
    ev.data.config.includes.push('\\.ts$','\\.js$');
  }

  onHandleCodeParser(ev) {
    const option = ev.data.option;
    const plugins = ev.data.parserOption.plugins;

    plugins.push('typescript')
  }
}

module.exports = new Plugin();
