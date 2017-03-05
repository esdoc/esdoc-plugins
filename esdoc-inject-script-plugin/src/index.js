const InjectScriptPlugin = require('./InjectScriptPlugin');

let plugin;

exports.onStart = function(ev) {
  plugin = new InjectScriptPlugin(ev.data.option);
};

exports.onHandleContent = function(ev) {
  ev.data.content = plugin.exec(ev.data.fileName, ev.data.content);
};

exports.onPublish = function(ev) {
  plugin.writeFile(ev.data.writeFile);
};
