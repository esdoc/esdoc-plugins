const CoveragePlugin = require('./CoveragePlugin');

let config;
let option;

exports.onStart = function(ev) {
  option = ev.data.option;
};

exports.onHandleConfig = function(ev) {
  config = ev.data.config;
};

exports.onHandleTag = function(ev) {
  const plugin = new CoveragePlugin(config, ev.data.tag, option);
  plugin.exec();
};
