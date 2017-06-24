const assert = require('assert');
const {find} = require('../util');

describe('test/MyClass.js:', ()=> {
  it('has default access', ()=>{
    const doc = find('longname', 'src/MyClass.js~MyClass#method1');
    assert.equal(doc.access, 'public');
    assert.equal(doc.ignore, undefined);
  });

  it('has public access', ()=>{
    const doc = find('longname', 'src/MyClass.js~MyClass#method2');
    assert.equal(doc.access, 'public');
    assert.equal(doc.ignore, undefined);
  });

  it('has protected access', ()=>{
    const doc = find('longname', 'src/MyClass.js~MyClass#method3');
    assert.equal(doc.access, 'protected');
    assert.equal(doc.ignore, undefined);
  });

  it('has private access and is ignored', ()=>{
    const doc = find('longname', 'src/MyClass.js~MyClass#method4');
    assert.equal(doc.access, 'private');
    assert.equal(doc.ignore, true);
  });

  it('has auto private access and is ignored', ()=>{
    const doc = find('longname', 'src/MyClass.js~MyClass#_method5');
    assert.equal(doc.access, 'private');
    assert.equal(doc.ignore, true);
  });
});

