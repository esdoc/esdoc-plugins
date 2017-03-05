const ImportPathPlugin = require('./ImportPathPlugin');

let config;

exports.onHandleConfig = function(ev) {
  config = ev.data.config;
};

exports.onHandleTag = function(ev) {
  const plugin = new ImportPathPlugin(config, ev.data.tag, ev.data.option);
  plugin.exec();
};
