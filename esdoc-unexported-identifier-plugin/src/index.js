const UnexportedIdentifierPlugin = require('./UnexportedIdentifierPlugin');

exports.onHandleTag = function(ev) {
  const plugin = new UnexportedIdentifierPlugin(ev.data.option);
  ev.data.tag = plugin.exec(ev.data.tag);
};
