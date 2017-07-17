const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

class Plugin {
  onStart(ev) {
    this._option = ev.data.option || {};
    if (!('enable' in this._option)) this._option.enable = true;
  }

  onHandleContent(ev) {
    if (!this._option.enable) return;
    if (path.extname(ev.data.fileName) !== '.html') return;

    const $ = cheerio.load(ev.data.content);

    let i = 0;
    for (const style of this._option.styles) {
      const src = `./inject/css/${i}-${path.basename(style)}`;
      $('head').append(`<link rel="stylesheet" href="${src}"/>`);
    }

    ev.data.content = $.html();
  }

  onPublish(ev) {
    if (!this._option.enable) return;

    let i = 0;
    for (const style of this._option.styles) {
      const outPath = `inject/css/${i}-${path.basename(style)}`;
      const content = fs.readFileSync(style).toString();
      ev.data.writeFile(outPath, content);
    }
  }
}

module.exports = new Plugin();
