const UnexportedIdentifierPlugin = require('./UnexportedIdentifierPlugin');

exports.onHandleDocs = function(ev) {
  const plugin = new UnexportedIdentifierPlugin(ev.data.option);
  ev.data.docs = plugin.exec(ev.data.docs);
};
