const assert = require('assert');
const {hasLine} = require('../util');

describe('test/myFunction.js:', ()=> {
  it('has function', ()=>{
    assert(hasLine('## `myFunction(p1: number): string`'));
    assert(hasLine('this is myFunction'));
  });

  it('has param', ()=>{
    assert(hasLine('| p1 | number |  | this is p1. |'));
  });
});
