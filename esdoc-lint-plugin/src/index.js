const LintPlugin = require('./LintPlugin.js');

let tags;

exports.onHandleTag = function(ev) {
  tags = ev.data.tag;
};

exports.onComplete = function(ev) {
  const lintPlugin = new LintPlugin(tags, ev.data.option);
  lintPlugin.exec();
};
