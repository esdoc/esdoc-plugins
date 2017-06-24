class Plugin {
  onHandleCodeParser(ev) {
    const option = ev.data.option;
    const plugins = ev.data.parserOption.plugins;

    if (option.all || option.classProperties) plugins.push('classProperties');
    if (option.all || option.objectRestSpread) plugins.push('objectRestSpread');
    if (option.all || option.doExpressions) plugins.push('doExpressions');
    if (option.all || option.functionBind) plugins.push('functionBind');
    if (option.all || option.functionSent) plugins.push('functionSent');
    if (option.all || option.asyncGenerators) plugins.push('asyncGenerators');
    if (option.all || option.decorators) plugins.push('decorators');
    if (option.all || option.exportExtensions) plugins.push('exportExtensions');
    if (option.all || option.dynamicImport) plugins.push('dynamicImport');
  }
}

module.exports = new Plugin();
