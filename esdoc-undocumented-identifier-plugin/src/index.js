const UndocumentedIdentifierPlugin = require('./UndocumentedIdentifierPlugin');

exports.onHandleDocs = function(ev) {
  const plugin = new UndocumentedIdentifierPlugin(ev.data.option);
  ev.data.docs = plugin.exec(ev.data.docs);
};
