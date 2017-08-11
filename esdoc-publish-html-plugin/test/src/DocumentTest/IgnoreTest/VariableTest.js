import {readDoc, assert, find} from './../../util.js';

/** @test {DocResolver#_resolveIgnore */
describe('testIgnoreVariable', ()=>{

  it('is not documented.', ()=>{
    assert.throws(()=> readDoc('Ignore/variable/index.html'));
  });
});
