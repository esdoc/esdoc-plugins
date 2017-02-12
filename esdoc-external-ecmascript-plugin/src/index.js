const ExternalECMAScriptPlugin = require('./ExternalECMAScriptPlugin');

let option;
let plugin;

exports.onStart = function(ev) {
  option = ev.data.option;
};

exports.onHandleConfig = function(ev) {
  plugin = new ExternalECMAScriptPlugin(ev.data.config, option);
  plugin.exec();
};

exports.onHandleTag = function(ev) {
  plugin.cleanup(ev.data.tag);
};
