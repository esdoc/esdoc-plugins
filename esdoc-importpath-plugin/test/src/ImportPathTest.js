const fs = require('fs');
const assert = require('assert');
const path = require('path');
const ESDocCLI = require('esdoc/out/src/ESDocCLI.js').default;

function cli() {
  const cliPath = path.resolve('./node_modules/esdoc/out/ESDocCLI.js');
  const argv = ['node', cliPath, '-c', './test/fixture/esdoc.json'];
  const cli = new ESDocCLI(argv);
  cli.exec();
}

cli();

describe('test import path results:', ()=> {
  const tmp = fs.readFileSync('./test/fixture/out/dump.json').toString();
  const tags = JSON.parse(tmp);

  it('converts simply', ()=> {
    const tag = tags.find(tag => tag.name === 'ImportPathTest1');
    assert.equal(tag.importPath, 'esdoc-importpath-plugin/lib/ImportPathTest1.js');
  });

  it('converts multiple', ()=>{
    const tag = tags.find(tag => tag.name === 'ImportPathTest2');
    assert.equal(tag.importPath, 'esdoc-importpath-plugin/lib/foo');
  });

  it('converts with package name', ()=>{
    const tag = tags.find(tag => tag.name === 'Index');
    assert.equal(tag.importPath, 'esdoc-importpath-plugin');
  });
});
