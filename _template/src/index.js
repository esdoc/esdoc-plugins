const TemplatePlugin = require('./TemplatePlugin');

exports.onHandleTag = function(ev) {
  const plugin = new TemplatePlugin(ev.data.tag, ev.data.option);
  plugin.exec();
};
