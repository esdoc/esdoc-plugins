const assert = require('assert');
const {find, file} = require('../util');

describe('test/TypeScript.js:', ()=> {
  it('has type of method, without comment', ()=>{
    const doc = find('longname', 'src/TypeScript.ts~TestTypeScriptClass#method1');

    assert.equal(doc.params.length, 2);
    assert.deepEqual(doc.params[0].types, ['number']);
    assert.deepEqual(doc.params[1].types, ['Foo']);

    assert.deepEqual(doc.return.types, ['string']);
  });

  it('has type of method, without tags', ()=>{
    const doc = find('longname', 'src/TypeScript.ts~TestTypeScriptClass#method2');
    assert.equal(doc.params.length, 2);
    assert.deepEqual(doc.params[0].types, ['number']);
    assert.deepEqual(doc.params[1].types, ['Foo']);

    assert.deepEqual(doc.return.types, ['string']);
  });

  it('has type of method, without type', ()=>{
    const doc = find('longname', 'src/TypeScript.ts~TestTypeScriptClass#method3');
    assert.equal(doc.params.length, 2);
    assert.deepEqual(doc.params[0].types, ['number']);
    assert.deepEqual(doc.params[1].types, ['Foo']);

    assert.deepEqual(doc.return.types, ['string']);
  });

  it('has type of getter, without comment', ()=>{
    const doc = find('longname', 'src/TypeScript.ts~TestTypeScriptClass#getter1');
    assert.deepEqual(doc.type.types, ['string']);
  });

  it('has type of setter, without comment', ()=>{
    const doc = find('longname', 'src/TypeScript.ts~TestTypeScriptClass#setter1');
    assert.deepEqual(doc.type.types, ['number']);
  });

  it('has type of member, without comment', ()=>{
    const doc = find('longname', 'src/TypeScript.ts~TestTypeScriptClass#member1');
    assert.deepEqual(doc.type.types, ['number']);
  });

  it('has type of function, without comment', ()=>{
    const doc = find('longname', 'src/TypeScript.ts~testTypeScriptFunction');

    assert.equal(doc.params.length, 2);
    assert.deepEqual(doc.params[0].types, ['number']);
    assert.deepEqual(doc.params[1].types, ['Foo']);

    assert.deepEqual(doc.return.types, ['string']);
  });
});


