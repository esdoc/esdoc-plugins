exports.onHandlePlugins = function(ev) {
  const option = ev.data.option || {};
  const plugins = [
    {name: 'esdoc-lint-plugin', option: {enable: option.lint}},
    {name: 'esdoc-coverage-plugin', option: {enable: option.coverage}},
    {name: 'esdoc-accessor-plugin', option: {access: option.access, autoPrivate: option.autoPrivate}},
    {name: 'esdoc-external-ecmascript-plugin'},
    {name: 'esdoc-brand-plugin', option: {title: option.title, repository: option.repository}},
    {name: 'esdoc-undocumented-identifier-plugin', option: {enable: option.undocumentIdentifier}},
    {name: 'esdoc-publish-html-plugin'}
  ];

  const existPluginNames = ev.data.plugins.map(plugin => plugin.name);
  for (const plugin of plugins) {
    if (existPluginNames.includes(plugin.name)) continue;
    cleanOption(plugin.option);
    ev.data.plugins.push(plugin);
  }
};

// remove `undefined` value
function cleanOption(option) {
  if (!option) return;

  for (const key of Object.keys(option)) {
    if (option[key] === undefined) delete option[key];
  }
}
