const CoveragePlugin = require('./CoveragePlugin');

let option;
let tags;

exports.onStart = function(ev) {
  option = ev.data.option;
};

exports.onHandleTag = function(ev) {
  tags = ev.data.tag;
};

exports.onPublish = function(ev) {
  const plugin = new CoveragePlugin(option);
  plugin.exec(tags, ev.data.writeFile);
};
