const LintPlugin = require('./LintPlugin.js');

let plugin;

exports.onHandleDocs = function(ev) {
  plugin = new LintPlugin(ev.data.docs, ev.data.option);
};

exports.onPublish = function(ev) {
  plugin.exec(ev.data.writeFile);
};

exports.onComplete = function() {
  plugin.showResult();
};
