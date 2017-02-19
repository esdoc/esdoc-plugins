const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');

class InjectScriptPlugin {
  constructor(config, option = {}) {
    this._config = config;
    this._option = option;

    if (!('enable' in this._option)) this._option.enable = true;
  }

  exec(html){
    if (!this._option.enable) return;

    const $ = cheerio.load(html);

    let i = 0;
    for (const script of this._option.scripts) {
      const src = `./inject/script/${i}-${path.basename(script)}`;
      $('header').append(`<script src="${src}"></script>`);
    }

    return $.html();
  }

  finish() {
    if (!this._option.enable) return;

    let i = 0;
    for (const script of this._option.scripts) {
      const tmp = `inject/script/${i}-${path.basename(script)}`;
      const src = path.resolve(this._config.destination, tmp);
      fs.copySync(script, src);
    }
  }
}

module.exports = InjectScriptPlugin;
