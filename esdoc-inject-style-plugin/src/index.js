const InjectStylePlugin = require('./InjectStylePlugin');

let option;
let plugin;

exports.onStart = function(ev) {
  option = ev.data.option;
};

exports.onHandleConfig = function(ev) {
  plugin = new InjectStylePlugin(ev.data.config, option);
};

exports.onHandleHTML = function(ev) {
  ev.data.html = plugin.exec(ev.data.html);
};

exports.onComplete = function() {
  plugin.finish();
};
