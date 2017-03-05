import PublishHTMLPlugin from './PublishHTMLPlugin';

let tags;

exports.onHandleTag = function(ev) {
  tags = ev.data.tag;
};

exports.onPublish = function(ev) {
  const plugin = new PublishHTMLPlugin(ev.data.option);
  plugin.exec(tags, ev.data.writeFile, ev.data.copyDir, ev.data.readFile);
};
