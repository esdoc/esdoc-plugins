const LintPlugin = require('./LintPlugin.js');

let docs;

exports.onHandleDocs = function(ev) {
  docs = ev.data.docs;
};

exports.onComplete = function(ev) {
  const lintPlugin = new LintPlugin(docs, ev.data.option);
  lintPlugin.exec();
};
