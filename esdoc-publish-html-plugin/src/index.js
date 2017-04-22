import PublishHTMLPlugin from './PublishHTMLPlugin';

let docs;

exports.onHandleDocs = function(ev) {
  docs = ev.data.docs;
};

exports.onPublish = function(ev) {
  const plugin = new PublishHTMLPlugin(ev.data.option);
  plugin.exec(docs, ev.data.writeFile, ev.data.copyDir, ev.data.readFile);
};
