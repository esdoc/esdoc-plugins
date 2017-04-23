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

describe('test unexported identifier result:', ()=> {
  const tmp = fs.readFileSync('./test/fixture/out/index.json').toString();
  const tags = JSON.parse(tmp);

  it('ignores unexported identifier.', ()=>{
    const tag = tags.find(tag => tag.name === 'TestUnexportedIdentifier1');
    assert.equal(tag.export, false);
    assert.equal(tag.ignore, true);
  });

  it('ignores exported identifier with @ignore.', ()=>{
    const tag = tags.find(tag => tag.name === 'TestUnexportedIdentifier2');
    assert.equal(tag.export, true);
    assert.equal(tag.ignore, true);
  });

  it('does not ignore exported identifier.', ()=>{
    const tag = tags.find(tag => tag.name === 'TestUnexportedIdentifier3');
    assert.equal(tag.export, true);
    assert.equal(tag.ignore, undefined);
  });
});

