const Plugin = require('./TemplatePlugin');

exports.onHandleDocs = function(ev) {
  const plugin = new Plugin(ev.data.docs, ev.data.option);
  plugin.exec();
};
