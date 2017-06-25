const assert = require('assert');
const {find, file} = require('../util');

describe('test unexported identifier result:', ()=> {

  it('ignores unexported identifier.', ()=>{
    const doc = find('name', 'MyClass1');
    assert.equal(doc.export, false);
    assert.equal(doc.ignore, true);
  });

  it('ignores exported identifier with @ignore.', ()=>{
    const doc = find('name', 'MyClass2');
    assert.equal(doc.export, true);
    assert.equal(doc.ignore, true);
  });

  it('does not ignore exported identifier.', ()=>{
    const doc = find('name', 'MyClass3');
    assert.equal(doc.export, true);
    assert.equal(doc.ignore, undefined);
  });
});

