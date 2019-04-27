class Plugin {
  onHandlePlugins(ev) {
    const option = ev.data.option || {};
    const plugins = [
      {name: '@sebastianwessel/esdoc-lint-plugin', option: option.lint},
      {name: '@sebastianwessel/esdoc-coverage-plugin', option: option.coverage},
      {name: '@sebastianwessel/esdoc-accessor-plugin', option: option.accessor},
      {name: '@sebastianwessel/esdoc-type-inference-plugin', option: option.typeInference},
      {name: '@sebastianwessel/esdoc-external-ecmascript-plugin'},
      {name: '@sebastianwessel/esdoc-brand-plugin', option: option.brand},
      {name: '@sebastianwessel/esdoc-undocumented-identifier-plugin', option: option.undocumentIdentifier},
      {name: '@sebastianwessel/esdoc-unexported-identifier-plugin', option: option.unexportedIdentifier},
      {name: '@sebastianwessel/esdoc-integrate-manual-plugin', option: option.manual},
      {name: '@sebastianwessel/esdoc-integrate-test-plugin', option: option.test},
      {name: '@sebastianwessel/esdoc-publish-html-plugin'}
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
