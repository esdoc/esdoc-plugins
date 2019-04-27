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
    
    plugins.push('@babel/plugin-proposal-export-default-from')
    plugins.push('@babel/plugin-proposal-class-properties')
    plugins.push('@babel/plugin-proposal-object-rest-spread')
    plugins.push('@babel/plugin-proposal-do-expressions')
    plugins.push('babel-plugin-transform-function-bind')
    plugins.push('@babel/plugin-proposal-function-sent')
    plugins.push('@babel/plugin-syntax-async-generators')
    plugins.push(['@babel/plugin-proposal-decorators',{ decoratorsBeforeExport: false }])
    plugins.push('@babel/plugin-syntax-export-extensions')
    plugins.push('@babel/plugin-syntax-dynamic-import')
    plugins.push('@babel/plugin-syntax-typescript')
    plugins.push('exportDefaultFrom')
    plugins.push('typescript')
    plugins.push('classProperties');
    plugins.push('objectRestSpread');
    plugins.push('doExpressions');
    plugins.push('functionBind');
    plugins.push('functionSent');
    plugins.push('asyncGenerators');
    plugins.push(['decorators', { decoratorsBeforeExport: false }]);
    plugins.push('exportExtensions');
    plugins.push('dynamicImport');
    
  }
}

module.exports = new Plugin();
