const ImportPathPlugin = require('./ImportPathPlugin');

let config;

exports.onHandleConfig = function(ev) {
  config = ev.data.config;
};

exports.onHandleDocs = function(ev) {
  const plugin = new ImportPathPlugin(config, ev.data.docs, ev.data.option);
  plugin.exec();
};
