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

describe('test exclude source result:', ()=> {
  const tmp = fs.readFileSync('./test/fixture/out/index.json').toString();
  const docs = JSON.parse(tmp);

  it('does not have source code.', ()=>{
    docs.forEach((doc) => {
      if (doc.kind === 'file' || doc.kind === 'testFile')  {
        assert.equal(doc.content, '');
      }
    });
  });
});

