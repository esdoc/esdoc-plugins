const BrandPlugin = require('./BrandPlugin');

let plugin;

exports.onHandleConfig = function(ev) {
  plugin = new BrandPlugin(ev.data.config, ev.data.option);
};

exports.onPublish = function(ev) {
  plugin.writeIcon(ev.data.copyFile);
  plugin.writeLogo(ev.data.copyFile);
};

exports.onHandleContent = function(ev) {
  ev.data.content = plugin.exec(ev.data.fileName, ev.data.content);
};
