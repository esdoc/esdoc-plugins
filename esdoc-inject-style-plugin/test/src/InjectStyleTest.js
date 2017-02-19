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

describe('test inject style result:', ()=> {
  it('has injected style tag title', ()=>{
    const html = fs.readFileSync('./test/fixture/out/index.html').toString();
    const $ = cheerio.load(html);
    assert.equal($('link[href="./inject/css/0-inject.css"]').length, 1);
  });

  it('has injected style', ()=>{
    const style = fs.readFileSync('./test/fixture/out/inject/css/0-inject.css').toString();
    assert.equal(style, "body { background: #eee; }\n");

  });
});

