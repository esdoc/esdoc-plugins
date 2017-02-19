const ExcludeSourcePlugin = require('./ExcludeSourcePlugin');

exports.onHandleTag = function(ev) {
  const plugin = new ExcludeSourcePlugin();
  ev.data.tag = plugin.exec(ev.data.tag);
};
