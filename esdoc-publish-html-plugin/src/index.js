import PublishHTMLPlugin from './PublishHTMLPlugin';

let option;
let config;
let tags;

exports.onStart = function(ev) {
  option = ev.data.option;
};

exports.onHandleConfig = function(ev) {
  config = ev.data.config;
};

exports.onHandleTag = function(ev) {
  tags = ev.data.tag;
};

exports.onPublish = function(ev) {
  const plugin = new PublishHTMLPlugin(config, option);
  plugin.exec(tags, ev.data.writeFile, ev.data.copyDir, ev.data.readFile);
};
