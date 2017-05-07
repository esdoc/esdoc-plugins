const assert = require('assert');
const {find} = require('../util');

describe('test/Getter.js:', ()=>{
  it('infer type that is literal', ()=>{
    const doc = find('longname', 'src/Getter.js~TestGetter#getLiteral');
    assert.deepEqual(doc.type, {types: ['number']});
  });

  it('infer type that is array', ()=>{
    const doc = find('longname', 'src/Getter.js~TestGetter#getArray');
    assert.deepEqual(doc.type, {types: ['number[]']});
  });

  it('infer type that is object', ()=>{
    const doc = find('longname', 'src/Getter.js~TestGetter#getObject');
    assert.deepEqual(doc.type, {types: ['{"x1": number, "x2": string}']});
  });

  it('infer type that is template literal', ()=>{
    const doc = find('longname', 'src/Getter.js~TestGetter#getTemplateLiteral');
    assert.deepEqual(doc.type, {types: ['string']});
  });
});
