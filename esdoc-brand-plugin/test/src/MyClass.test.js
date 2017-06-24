const fs = require('fs');
const assert = require('assert');
const cheerio = require('cheerio');

describe('test/MyClass.js:', ()=> {
  const $ = cheerio.load(fs.readFileSync('./test/out/index.html'));

  it('has brand logo', ()=>{
    assert.equal($('header a[href="./"] img[src="./image/brand_logo.png"]').length, 1);
    assert(fs.readFileSync('./test/out/image/brand_logo.png'));
  });

  it('has brand title', ()=>{
    assert.equal($('title').text(), 'Home | esdoc-brand-plugin-test');
  });

  it('has repository link', ()=>{
    assert.equal($('header a[href="https://github.com/esdoc/esdoc-optional-plugins"]').length, 1);
    assert.equal($('header img[src="./image/github.png"]').length, 1);
    assert(fs.readFileSync('./test/out/image/github.png'));
  });

  it('has meta tag', ()=>{
    // normal
    assert.equal($('meta[name="description"]').attr('content'), 'this is esdoc-brand-plugin test');

    // og
    assert.equal($('meta[property="og:type"]').attr('content'), 'website');
    assert.equal($('meta[property="og:url"]').attr('content'), 'https://esdoc.org');
    assert.equal($('meta[property="og:site_name"]').attr('content'), 'esdoc-brand-plugin-test');
    assert.equal($('meta[property="og:title"]').attr('content'), 'esdoc-brand-plugin-test');
    assert.equal($('meta[property="og:image"]').attr('content'), 'https://esdoc.org/manual/asset/image/logo.png');
    assert.equal($('meta[property="og:description"]').attr('content'), 'this is esdoc-brand-plugin test');
    assert.equal($('meta[property="og:author"]').attr('content'), 'http://h13i32maru.jp');

    // twitter
    assert.equal($('meta[property="twitter:card"]').attr('content'), 'summary');
    assert.equal($('meta[property="twitter:title"]').attr('content'), 'esdoc-brand-plugin-test');
    assert.equal($('meta[property="twitter:description"]').attr('content'), 'this is esdoc-brand-plugin test');
    assert.equal($('meta[property="twitter:image"]').attr('content'), 'https://esdoc.org/manual/asset/image/logo.png');
  });
});

