const ImportPathPlugin = require('./ImportPathPlugin');

let option;
let config;

exports.onStart = function(ev) {
  option = ev.data.option;
};

exports.onHandleConfig = function(ev) {
  config = ev.data.config;
};

exports.onHandleTag = function(ev) {
  const plugin = new ImportPathPlugin(config, ev.data.tag, option);
  plugin.exec();
};
