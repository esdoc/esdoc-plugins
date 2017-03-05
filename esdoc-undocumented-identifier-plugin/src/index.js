const UndocumentedIdentifierPlugin = require('./UndocumentedIdentifierPlugin');

exports.onHandleTag = function(ev) {
  const plugin = new UndocumentedIdentifierPlugin(ev.data.option);
  ev.data.tag = plugin.exec(ev.data.tag);
};
