const assert = require('assert');
const path = require('path');
const fs = require('fs');
const ESDocCLI = require('esdoc/out/src/ESDocCLI.js').default;

function cli() {
  const cliPath = path.resolve('./node_modules/esdoc/out/ESDocCLI.js');
  const argv = ['node', cliPath, '-c', './test/fixture/esdoc.json'];
  const cli = new ESDocCLI(argv);
  cli.exec();
}

cli();

describe('test jsx result:', ()=> {
  const dump = fs.readFileSync('./test/fixture/out/index.json').toString();
  const tags = JSON.parse(dump);

  it('can parse jsx', ()=>{
    const tag = tags.find(tag => tag.longname === 'src/TestJSX.js~TestJSX#method');
    assert(tag);
  });
});

