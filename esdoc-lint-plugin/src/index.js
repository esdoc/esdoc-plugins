const LintPlugin = require('./LintPlugin.js');

let config;
let tags;
let option;

exports.onStart = function(ev) {
  option = ev.data.option;
};

exports.onHandleConfig = function(ev) {
  config = ev.data.config;
};

exports.onHandleTag = function(ev) {
  tags = ev.data.tag;
};

exports.onComplete = function() {
  const lintPlugin = new LintPlugin(config, tags, option);
  lintPlugin.exec();
};
