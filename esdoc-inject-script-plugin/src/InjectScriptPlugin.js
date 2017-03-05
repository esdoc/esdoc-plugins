const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');

class InjectScriptPlugin {
  constructor(option = {}) {
    this._option = option;

    if (!('enable' in this._option)) this._option.enable = true;
  }

  exec(fileName, content){
    if (!this._option.enable) return content;
    if (path.extname(fileName) !== '.html') return content;

    const $ = cheerio.load(content);

    let i = 0;
    for (const script of this._option.scripts) {
      const src = `./inject/script/${i}-${path.basename(script)}`;
      $('header').append(`<script src="${src}"></script>`);
    }

    return $.html();
  }

  writeFile(writeFile) {
    if (!this._option.enable) return;

    let i = 0;
    for (const script of this._option.scripts) {
      const outPath = `inject/script/${i}-${path.basename(script)}`;
      const content = fs.readFileSync(script).toString();
      console.log(content);
      writeFile(outPath, content);
    }
  }
}

module.exports = InjectScriptPlugin;
