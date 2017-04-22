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

describe('test accessor result:', ()=> {
  const dump = fs.readFileSync('./test/fixture/out/index.json').toString();
  const tags = JSON.parse(dump);

  it('has default access', ()=>{
    const tag = tags.find(tag => tag.longname === 'src/TestAccessor.js~TestAccessor#method1');
    assert.equal(tag.access, 'public');
    assert.equal(tag.ignore, undefined);
  });

  it('has public access', ()=>{
    const tag = tags.find(tag => tag.longname === 'src/TestAccessor.js~TestAccessor#method2');
    assert.equal(tag.access, 'public');
    assert.equal(tag.ignore, undefined);
  });

  it('has protected access', ()=>{
    const tag = tags.find(tag => tag.longname === 'src/TestAccessor.js~TestAccessor#method3');
    assert.equal(tag.access, 'protected');
    assert.equal(tag.ignore, undefined);
  });

  it('has private access and is ignored', ()=>{
    const tag = tags.find(tag => tag.longname === 'src/TestAccessor.js~TestAccessor#method4');
    assert.equal(tag.access, 'private');
    assert.equal(tag.ignore, true);
  });

  it('has auto private access and is ignored', ()=>{
    const tag = tags.find(tag => tag.longname === 'src/TestAccessor.js~TestAccessor#_method5');
    assert.equal(tag.access, 'private');
    assert.equal(tag.ignore, true);
  });
});

