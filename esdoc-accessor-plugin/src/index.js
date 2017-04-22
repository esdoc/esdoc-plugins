const AccessorPlugin = require('./AccessorPlugin');

exports.onHandleDocs = function(ev) {
  const plugin = new AccessorPlugin(ev.data.docs, ev.data.option);
  plugin.exec();
};
