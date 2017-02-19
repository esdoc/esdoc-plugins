const ExternalNodejsPlugin = require('./ExternalNodejsPlugin');

let option;
let plugin;

exports.onStart = function(ev) {
  option = ev.data.option;
};

exports.onHandleConfig = function(ev) {
  plugin = new ExternalNodejsPlugin(ev.data.config, option);
  plugin.exec();
};

exports.onHandleTag = function(ev) {
  plugin.cleanup(ev.data.tag);
};
