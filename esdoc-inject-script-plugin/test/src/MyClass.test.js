const assert = require('assert');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');

describe('test inject script result:', ()=> {
  it('has injected script tag title', ()=>{
    const html = fs.readFileSync('./test/out/index.html').toString();
    const $ = cheerio.load(html);
    assert.equal($('script[src="./inject/script/0-inject.js"]').length, 1);
  });

  it('has injected script', ()=>{
    const script = fs.readFileSync('./test/out/inject/script/0-inject.js').toString();
    assert.equal(script, "console.log('this is injected script');\n");

  });
});

