const CoveragePlugin = require('./CoveragePlugin');

let tags;

exports.onHandleTag = function(ev) {
  tags = ev.data.tag;
};

exports.onPublish = function(ev) {
  const plugin = new CoveragePlugin(ev.data.option);
  plugin.exec(tags, ev.data.writeFile);
};
