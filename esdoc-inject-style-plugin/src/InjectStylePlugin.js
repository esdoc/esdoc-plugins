const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');

class InjectStylePlugin {
  constructor(option = {}) {
    this._option = option;

    if (!('enable' in this._option)) this._option.enable = true;
  }

  exec(fileName, content){
    if (!this._option.enable) return content;
    if (path.extname(fileName) !== '.html') return content;

    const $ = cheerio.load(content);

    let i = 0;
    for (const style of this._option.styles) {
      const src = `./inject/css/${i}-${path.basename(style)}`;
      $('header').append(`<link rel="stylesheet" href="${src}"/>`);
    }

    return $.html();
  }

  writeFile(writeFile) {
    if (!this._option.enable) return;

    let i = 0;
    for (const style of this._option.styles) {
      const outPath = `inject/css/${i}-${path.basename(style)}`;
      const content = fs.readFileSync(style).toString();
      writeFile(outPath, content);
    }
  }
}

module.exports = InjectStylePlugin;
