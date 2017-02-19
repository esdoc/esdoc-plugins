const UndocumentedIdentifierPlugin = require('./UndocumentedIdentifierPlugin');

let option;

exports.onStart = function(ev) {
  option = ev.data.option;
};

exports.onHandleTag = function(ev) {
  const plugin = new UndocumentedIdentifierPlugin(option);
  ev.data.tag = plugin.exec(ev.data.tag);
};
