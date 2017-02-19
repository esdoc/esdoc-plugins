const BrandPlugin = require('./BrandPlugin');

let option;
let plugin;

exports.onStart = function(ev) {
  option = ev.data.option;
};

exports.onHandleConfig = function(ev) {
  plugin = new BrandPlugin(ev.data.config, option);
};

exports.onHandleHTML = function(ev) {
  ev.data.html = plugin.exec(ev.data.html);
};

exports.onComplete = function() {
  plugin.finish();
};
