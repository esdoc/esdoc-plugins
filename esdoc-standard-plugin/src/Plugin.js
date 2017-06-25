class Plugin {
  onHandlePlugins(ev) {
    const option = ev.data.option || {};
    const plugins = [
      {name: 'esdoc-lint-plugin', option: option.lint},
      {name: 'esdoc-coverage-plugin', option: option.coverage},
      {name: 'esdoc-accessor-plugin', option: option.accessor},
      {name: 'esdoc-type-inference-plugin', option: option.typeInference},
      {name: 'esdoc-external-ecmascript-plugin'},
      {name: 'esdoc-brand-plugin', option: option.brand},
      {name: 'esdoc-undocumented-identifier-plugin', option: option.undocumentIdentifier},
      {name: 'esdoc-unexported-identifier-plugin', option: option.unexportedIdentifier},
      {name: 'esdoc-integrate-manual-plugin', option: option.manual},
      {name: 'esdoc-integrate-test-plugin', option: option.test},
      {name: 'esdoc-publish-html-plugin'}
    ];

    const existPluginNames = ev.data.plugins.map(plugin => plugin.name);
    for (const plugin of plugins) {
      if (existPluginNames.includes(plugin.name)) continue;
      if (plugin.option === undefined) delete plugin.option;
      ev.data.plugins.push(plugin);
    }
  }
}

module.exports = new Plugin();
