const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');

class Plugin {
  onStart(ev) {
    this._option = ev.data.option || {};
    if (!('enable' in this._option)) this._option.enable = true;
  }

  onHandleContent(ev) {
    if (!this._option.enable) return;

    const fileName = ev.data.fileName;
    if (path.extname(fileName) !== '.html') return;

    const $ = cheerio.load(ev.data.content);

    let i = 0;
    for (const script of this._option.scripts) {
      const src = `./inject/script/${i}-${path.basename(script)}`;
      $('head').append(`<script src="${src}"></script>`);
    }

    ev.data.content = $.html();
  }

  onPublish(ev) {
    if (!this._option.enable) return;

    let i = 0;
    for (const script of this._option.scripts) {
      const outPath = `inject/script/${i}-${path.basename(script)}`;
      const content = fs.readFileSync(script).toString();
      ev.data.writeFile(outPath, content);
    }
  }
}

module.exports = new Plugin();
