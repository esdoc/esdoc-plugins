const ExternalNodejsPlugin = require('./ExternalNodejsPlugin');

let plugin;

exports.onHandleConfig = function(ev) {
  plugin = new ExternalNodejsPlugin(ev.data.config, ev.data.option);
  plugin.exec();
};

exports.onHandleTag = function(ev) {
  plugin.cleanup(ev.data.tag);
};
