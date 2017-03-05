const InjectStylePlugin = require('./InjectStylePlugin');

let plugin;

exports.onStart = function(ev) {
  plugin = new InjectStylePlugin(ev.data.option);
};

exports.onHandleContent = function(ev) {
  ev.data.content = plugin.exec(ev.data.fileName, ev.data.content);
};

exports.onPublish = function(ev) {
  plugin.writeFile(ev.data.writeFile);
};
