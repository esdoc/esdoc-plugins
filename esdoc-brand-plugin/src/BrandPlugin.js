const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

class BrandPlugin {
  constructor(config, option = {}) {
    this._config = config;

    // get package.json
    let packageObj = {};
    try {
      const packagePath = config.package || './package.json';
      const tmp = fs.readFileSync(packagePath).toString();
      packageObj = JSON.parse(tmp);
    } catch (e) {
      // ignore
    }

    this._title = option.title || packageObj.name;
    this._repository = option.repository || this._getRepositoryURL(packageObj);
  }

  _getRepositoryURL(packageObj) {
    if (!packageObj.repository) return null;

    let url = packageObj.repository.url || packageObj.repository;
    if (typeof url !== 'string') return null;

    if (url.indexOf('git@github.com:') === 0) { // url: git@github.com:foo/bar.git
      const matched = url.match(/^git@github\.com:(.*)\.git$/);
      return `https://github.com/${matched[1]}`;
    } else if (url.match(/^[\w\d\-_]+\/[\w\d\-_]+$/)) { // url: foo/bar
      return `https://github.com/${url}`;
    } else if (url.match(/^git\+https:\/\/github.com\/.*\.git$/)) { // git+https://github.com/foo/bar.git
      const matched = url.match(/^git\+(https:\/\/github.com\/.*)\.git$/);
      return matched[1];
    } else if (url.match(/(https?:\/\/.*$)/)) { // other url
      const matched = url.match(/(https?:\/\/.*$)/);
      return matched[1];
    }

    return null;
  }

  exec(fileName, content){
    if (path.extname(fileName) !== '.html') return content;

    const $ = cheerio.load(content);

    // title
    if (this._title) {
      const $title = $('title');
      const original = $title.text();
      $title.text(`${original} | ${this._title}`);
    }

    // repository
    if (this._repository) {
      if (this._repository.indexOf('https://github.com/') === 0) {
        const style = 'style="position:relative; top:3px;"';
        $('header').append(`<a ${style} href="${this._repository}"><img width="20px" src="./image/github.png"/></a>`);
      } else {
        $('header').append(`<a href="${this._repository}">Repository</a>`);
      }
    }

    return $.html();
  }

  writeIcon(writeFile) {
    if (this._repository.indexOf('https://github.com/') === 0) {
      const srcPath = path.resolve(__dirname, 'github.png');
      const content = fs.readFileSync(srcPath).toString();
      writeFile('image/github.png', content);
    }
  }
}

module.exports = BrandPlugin;
