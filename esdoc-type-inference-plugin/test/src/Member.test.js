const assert = require('assert');
const {find} = require('../util');

describe('test/Member.js:', ()=>{
  it('infer type that is literal', ()=>{
    const doc = find('longname', 'src/Member.js~TestMember#memberLiteral');
    assert.deepEqual(doc.type, {types: ['number']});
  });

  it('infer type that is array', ()=>{
    const doc = find('longname', 'src/Member.js~TestMember#memberArray');
    assert.deepEqual(doc.type, {types: ['number[]']});
  });

  it('infer type that is object', ()=>{
    const doc = find('longname', 'src/Member.js~TestMember#memberObject');
    assert.deepEqual(doc.type, {types: ['{"x1": number, "x2": string}']});
  });

  it('infer type that is template literal', ()=>{
    const doc = find('longname', 'src/Member.js~TestMember#memberTemplateLiteral');
    assert.deepEqual(doc.type, {types: ['string']});
  });
});
