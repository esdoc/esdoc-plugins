const assert = require('assert');
const {find} = require('../util');

describe('test/Variable.js:', ()=>{
  it('infer type that is literal', ()=>{
    const doc = find('longname', 'src/Variable.js~testVariableLiteral');
    assert.deepEqual(doc.type, {types: ['number']});
  });

  it('infer type that is array', ()=>{
    const doc = find('longname', 'src/Variable.js~testVariableArray');
    assert.deepEqual(doc.type, {types: ['number[]']});
  });

  it('infer type that is object', ()=>{
    const doc = find('longname', 'src/Variable.js~testVariableObject');
    assert.deepEqual(doc.type, {types: ['{"x1": number, "x2": string}']});
  });

  it('infer type that is template literal', ()=>{
    const doc = find('longname', 'src/Variable.js~testVariableTemplateLiteral');
    assert.deepEqual(doc.type, {types: ['string']});
  });

  it('infer type that is new expression with same file', ()=>{
    const doc = find('longname', 'src/Variable.js~testVariableNewExpression');
    assert.deepEqual(doc.type, {types: ['src/Variable.js~TestVariableNewExpression']});
  });

  it('infer type that is new expression with other file', ()=>{
    const doc = find('longname', 'src/Variable.js~testVariableNewExpressionOtherFile');
    assert.deepEqual(doc.type, {types: ['src/Member.js~TestMember']});
  });
});
