const CoveragePlugin = require('./CoveragePlugin');

let config;

exports.onHandleConfig = function(ev) {
  config = ev.data.config;
};

exports.onHandleTag = function(ev) {
  const plugin = new CoveragePlugin(config, ev.data.tag);
  plugin.exec();
};
