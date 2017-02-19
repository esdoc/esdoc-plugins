const assert = require('assert');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const ESDocCLI = require('esdoc/out/src/ESDocCLI.js').default;

function cli() {
  const cliPath = path.resolve('./node_modules/esdoc/out/ESDocCLI.js');
  const argv = ['node', cliPath, '-c', './test/fixture/esdoc.json'];
  const cli = new ESDocCLI(argv);
  cli.exec();
}

cli();

describe('test brand result:', ()=> {
  it('has brand title', ()=>{
    const html = fs.readFileSync('./test/fixture/out/index.html').toString();
    const $ = cheerio.load(html);
    assert.equal($('title').text(), 'Home | ESDoc Brand Plugin');
  });

  it('has repository link', ()=>{
    const html = fs.readFileSync('./test/fixture/out/index.html').toString();
    const $ = cheerio.load(html);
    assert.equal($('header a[href="https://github.com/esdoc/esdoc-optional-plugins"]').length, 1);
    assert.equal($('header img[src="./image/github.png"]').length, 1);
  });
});

