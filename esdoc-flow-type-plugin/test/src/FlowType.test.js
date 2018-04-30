const assert = require('assert');
const {find, file} = require('../util');

describe('test/FlowType.js:', ()=> {
  it('has type of method, without comment', ()=>{
    const doc = find('longname', 'src/FlowType.js~TestFlowTypeClass#method1');

    assert.equal(doc.params.length, 2);
    assert.deepEqual(doc.params[0].types, ['number']);
    assert.deepEqual(doc.params[1].types, ['Foo']);

    assert.deepEqual(doc.return.types, ['string']);
  });

  it('has type of method, without tags', ()=>{
    const doc = find('longname', 'src/FlowType.js~TestFlowTypeClass#method2');
    assert.equal(doc.params.length, 2);
    assert.deepEqual(doc.params[0].types, ['number']);
    assert.deepEqual(doc.params[1].types, ['Foo']);

    assert.deepEqual(doc.return.types, ['string']);
  });

  it('has type of method, without type', ()=>{
    const doc = find('longname', 'src/FlowType.js~TestFlowTypeClass#method3');
    assert.equal(doc.params.length, 2);
    assert.deepEqual(doc.params[0].types, ['number']);
    assert.deepEqual(doc.params[1].types, ['Foo']);

    assert.deepEqual(doc.return.types, ['string']);
  });

  it('has type of method, extracting proper argument types', ()=>{
    const doc = find('longname', 'src/FlowType.js~TestFlowTypeClass#method4');
    assert.equal(doc.params.length, 4);
    assert.deepEqual(doc.params[0].types, ['[number, number]']);
    assert.deepEqual(doc.params[1].types, ['Foo<string>']);
    assert.deepEqual(doc.params[2].types, ['string' , 'void']);
    assert.deepEqual(doc.params[3].types, ['THREE.Vector3']);

    assert.deepEqual(doc.return.types, ['string']);
    assert.equal(doc.return.nullable, true);
  });

  it('has type of getter, without comment', ()=>{
    const doc = find('longname', 'src/FlowType.js~TestFlowTypeClass#getter1');
    assert.deepEqual(doc.type.types, ['string']);
  });

  it('has type of setter, without comment', ()=>{
    const doc = find('longname', 'src/FlowType.js~TestFlowTypeClass#setter1');
    assert.deepEqual(doc.type.types, ['number']);
  });

  it('has type of member, without comment', ()=>{
    const doc = find('longname', 'src/FlowType.js~TestFlowTypeClass#member1');
    assert.deepEqual(doc.type.types, ['number']);
  });

  it('has type of function, without comment', ()=>{
    const doc = find('longname', 'src/FlowType.js~testFlowTypeFunction');

    assert.equal(doc.params.length, 2);
    assert.deepEqual(doc.params[0].types, ['number']);
    assert.deepEqual(doc.params[1].types, ['Foo']);

    assert.deepEqual(doc.return.types, ['string']);
  });
});

