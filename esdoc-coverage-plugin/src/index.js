const CoveragePlugin = require('./CoveragePlugin');

let docs;

exports.onHandleDocs = function(ev) {
  docs = ev.data.docs;
};

exports.onPublish = function(ev) {
  const plugin = new CoveragePlugin(ev.data.option);
  plugin.exec(docs, ev.data.writeFile);
};
