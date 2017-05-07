const Plugin = require('./IntegrateManualPlugin');

exports.onHandleDocs = function(ev) {
  const plugin = new Plugin(ev.data.docs, ev.data.option);
  plugin.exec();
};
