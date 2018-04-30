const toMarkdown = require('to-markdown');
const ClassBuilder = require('./ClassBuilder');
const FunctionBuilder = require('./FunctionBuilder');

class Plugin {
  onHandleDocs(ev) {
    this._docs = ev.data.docs;
  }

  onPublish(ev) {

    // create builder
    const classBuilder = new ClassBuilder(this._docs);
    const functionBuilder = new FunctionBuilder(this._docs);

    // create html
    let html = '';
    html += '<h1>Class</h1>\n' + classBuilder.makeHTML() + '\n';
    html += '<h1>Function</h1>\n' + functionBuilder.makeHTML() + '\n';

    // to markdown
    const markdown = this._toMarkdown(html);

    // write file
    const filename = ev.data.option && ev.data.option.filename ? ev.data.option.filename : 'index.md';
    ev.data.writeFile(filename, markdown);
  }

  _toMarkdown(html) {
    // div is using as wrapper. so remove self tag.
    const converter = {
      filter: 'div',
      replacement: function (innerHTML, node) {
        return innerHTML;
      }
    };

    return toMarkdown(html, {gfm: true, converters: [converter]});
  }
}

module.exports = new Plugin();
