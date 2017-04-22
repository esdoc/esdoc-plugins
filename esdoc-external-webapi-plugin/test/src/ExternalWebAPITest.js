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

describe('test external web api results:', ()=>{
  const tmp = fs.readFileSync('./test/fixture/out/index.json').toString();
  const tags = JSON.parse(tmp);

  it('has external web api.', ()=>{
    const tag = tags.find(tag => tag.kind === 'external' && tag.name === 'XMLHttpRequest');
    assert.equal(tag.externalLink, 'https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest');
  });

  it('removed external-webapi.js', ()=>{
    assert.throws(()=>{
      fs.readFileSync('./test/fixture/src/.external-webapi.js');
    });
  });
});
