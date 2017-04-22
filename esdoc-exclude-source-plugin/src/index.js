const ExcludeSourcePlugin = require('./ExcludeSourcePlugin');

exports.onHandleDocs = function(ev) {
  const plugin = new ExcludeSourcePlugin();
  ev.data.docs = plugin.exec(ev.data.docs);
};
