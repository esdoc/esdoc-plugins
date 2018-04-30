const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

class Plugin {
  onHandleConfig(ev) {
    const config = ev.data.config;
    const option = ev.data.option || {};

    // get package.json
    let packageObj = {};
    try {
      const packagePath = config.package || './package.json';
      const tmp = fs.readFileSync(packagePath).toString();
      packageObj = JSON.parse(tmp);
    } catch (e) {
      // ignore
    }

    this._logo = option.logo;
    this._description = option.description || packageObj.description;
    this._title = option.title || packageObj.name;
    this._repository = option.repository || this._getRepositoryURL(packageObj);
    this._site = option.site || packageObj.homepage;
    this._image = option.image;
    this._author = option.author || this._getAuthor(packageObj);
  }

  onPublish(ev) {
    if (this._repository && this._repository.indexOf('https://github.com/') === 0) {
      const srcPath = path.resolve(__dirname, 'github.png');
      ev.data.copyFile(srcPath, 'image/github.png');
    }

    if (this._logo) {
      const srcPath = path.resolve(this._logo);
      ev.data.copyFile(srcPath, 'image/brand_logo' + path.extname(this._logo));
    }
  }

  onHandleContent(ev) {
    const content = ev.data.content;
    const fileName = ev.data.fileName;

    if (path.extname(fileName) !== '.html') return content;

    const $ = cheerio.load(content);

    // logo
    if (this._logo) {
      const $el = $('header a[href="./"]');
      $el.text('');
      $el.css({display: 'flex', 'align-items': 'center'});
      $el.append('<img src="./image/brand_logo' + path.extname(this._logo) + '" style="width:34px;">');
    }

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

    // meta tag
    this._addMetaTag($);

    ev.data.content = $.html();
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

  _getAuthor(packageObj) {
    if (!packageObj.author) return null;

    if (typeof packageObj.author === 'string') {
      return packageObj.author;
    } else {
      return packageObj.author.url || packageObj.author.name;
    }
  }

  _addMetaTag($) {
    const metaProps = [];

    // normal
    if (this._description){
      metaProps.push({name: 'description', content: this._description});
    }

    // og tag http://ogp.me/#metadata
    if (this._title && this._image && this._site){
      metaProps.push({property: 'og:type', content: 'website'});
      metaProps.push({property: 'og:url', content: this._site});
      metaProps.push({property: 'og:site_name', content: this._title});
      metaProps.push({property: 'og:title', content: this._title});
      metaProps.push({property: 'og:image', content: this._image});

      if (this._description) metaProps.push({property: 'og:description', content: this._description});
      if (this._author) metaProps.push({property: 'og:author', content: this._author});
    }

    // twitter card https://dev.twitter.com/cards/types/summary
    if (this._title && this._description){
      metaProps.push({property: 'twitter:card', content: 'summary'});
      metaProps.push({property: 'twitter:title', content: this._title});
      metaProps.push({property: 'twitter:description', content: this._description});

      if (this._image) metaProps.push({property: 'twitter:image', content: this._image});
      if (this._site && this._site.indexOf('https://twitter.com/') === 0) {
        const twitterName = this._site.replace('https://twitter.com/', '@');
        metaProps.push({property: 'twitter:site', content: twitterName});
        metaProps.push({property: 'twitter:creator', content: twitterName});
      }
    }

    const $head = $('head');
    for (const metaProp of metaProps) {
      const prop = Object.keys(metaProp).map((key) => `${key}="${metaProp[key]}"`).join(' ');
      const metaTag = `<meta ${prop}>`;
      $head.append(metaTag);
    }
  }
}

module.exports = new Plugin();
