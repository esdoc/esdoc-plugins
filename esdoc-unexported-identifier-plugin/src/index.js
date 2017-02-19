const UnexportedIdentifierPlugin = require('./UnexportedIdentifierPlugin');

let option;

exports.onStart = function(ev) {
  option = ev.data.option;
};

exports.onHandleTag = function(ev) {
  const plugin = new UnexportedIdentifierPlugin(option);
  ev.data.tag = plugin.exec(ev.data.tag);
};
