const ExternalECMAScriptPlugin = require('./ExternalECMAScriptPlugin');

let plugin;

exports.onHandleConfig = function(ev) {
  plugin = new ExternalECMAScriptPlugin(ev.data.config, ev.data.option);
  plugin.exec();
};

exports.onHandleTag = function(ev) {
  plugin.cleanup(ev.data.tag);
};
