const assert = require('assert');
const {find} = require('../util');

describe('test/Return.js:', ()=>{
  it('infer return value that is literal', ()=>{
    const doc = find('longname', 'src/Return.js~TestReturn#methodLiteral');
    assert.deepEqual(doc.return, {types: ['number']});
  });

  it('infer return value that is array', ()=>{
    const doc = find('longname', 'src/Return.js~TestReturn#methodArray');
    assert.deepEqual(doc.return, {types: ['number[]']});
  });

  it('infer return value that is object', ()=>{
    const doc = find('longname', 'src/Return.js~TestReturn#methodObject');
    assert.deepEqual(doc.return, {types: ['{"x1": number, "x2": string}']});
  });

  it('infer return value that is template literal', ()=>{
    const doc = find('longname', 'src/Return.js~TestReturn#methodTemplateLiteral');
    assert.deepEqual(doc.return, {types: ['string']});
  });
});
