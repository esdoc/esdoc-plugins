const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');

class InjectStylePlugin {
  constructor(config, option = {}) {
    this._config = config;
    this._option = option;

    if (!('enable' in this._option)) this._option.enable = true;
  }

  exec(html){
    if (!this._option.enable) return;

    const $ = cheerio.load(html);

    let i = 0;
    for (const style of this._option.styles) {
      const src = `./inject/css/${i}-${path.basename(style)}`;
      $('header').append(`<link rel="stylesheet" href="${src}"/>`);
    }

    return $.html();
  }

  finish() {
    if (!this._option.enable) return;

    let i = 0;
    for (const style of this._option.styles) {
      const tmp = `inject/css/${i}-${path.basename(style)}`;
      const src = path.resolve(this._config.destination, tmp);
      fs.copySync(style, src);
    }
  }
}

module.exports = InjectStylePlugin;
