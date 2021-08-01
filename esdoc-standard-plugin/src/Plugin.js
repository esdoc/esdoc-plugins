class Plugin {
  onHandlePlugins(ev) {
    const option = ev.data.option || {};
    const plugins = [
      {name: 'esdoc-latest-lint-plugin', option: option.lint},
      {name: 'esdoc-latest-coverage-plugin', option: option.coverage},
      {name: 'esdoc-latest-accessor-plugin', option: option.accessor},
      {name: 'esdoc-latest-type-inference-plugin', option: option.typeInference},
      {name: 'esdoc-latest-external-ecmascript-plugin'},
      {name: 'esdoc-latest-brand-plugin', option: option.brand},
      {name: 'esdoc-latest-undocumented-identifier-plugin', option: option.undocumentIdentifier},
      {name: 'esdoc-latest-unexported-identifier-plugin', option: option.unexportedIdentifier},
      {name: 'esdoc-latest-integrate-manual-plugin', option: option.manual},
      {name: 'esdoc-latest-integrate-test-plugin', option: option.test},
      {name: 'esdoc-latest-publish-html-plugin'}
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
