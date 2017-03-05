const AccessorPlugin = require('./AccessorPlugin');

exports.onHandleTag = function(ev) {
  const plugin = new AccessorPlugin(ev.data.tag, ev.data.option);
  plugin.exec();
};
