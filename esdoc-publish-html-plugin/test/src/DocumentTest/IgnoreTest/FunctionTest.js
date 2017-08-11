import {readDoc, assert, find} from './../../util.js';

/** @test {DocResolver#_resolveIgnore */
describe('testIgnoreFunction', ()=>{

  it('is not documented.', ()=>{
    assert.throws(()=> readDoc('Ignore/function/index.html'));
  });
});
