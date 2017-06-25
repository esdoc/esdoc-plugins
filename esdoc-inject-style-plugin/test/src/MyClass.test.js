const assert = require('assert');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');

describe('test inject style result:', ()=> {
  it('has injected style tag title', ()=>{
    const html = fs.readFileSync('./test/out/index.html').toString();
    const $ = cheerio.load(html);
    assert.equal($('link[href="./inject/css/0-inject.css"]').length, 1);
  });

  it('has injected style', ()=>{
    const style = fs.readFileSync('./test/out/inject/css/0-inject.css').toString();
    assert.equal(style, "body { background: #eee; }\n");

  });
});

