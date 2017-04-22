const ExternalWebAPIPlugin = require('./ExternalWebAPIPlugin');

let plugin;

exports.onHandleConfig = function(ev) {
  plugin = new ExternalWebAPIPlugin(ev.data.config, ev.data.option);
  plugin.exec();
};

exports.onHandleDocs = function(ev) {
  plugin.cleanup(ev.data.docs);
};
