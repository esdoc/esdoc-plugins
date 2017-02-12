const AccessorPlugin = require('./AccessorPlugin');

let option;
exports.onStart = function(ev) {
  option = ev.data.option;
};

exports.onHandleTag = function(ev) {
  const plugin = new AccessorPlugin(ev.data.tag, option);
  plugin.exec();
};
