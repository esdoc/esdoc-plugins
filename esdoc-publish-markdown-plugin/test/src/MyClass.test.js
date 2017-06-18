const assert = require('assert');
const {hasLine} = require('../util');

describe('test/MyClass.js:', ()=> {
  it('has class', ()=>{
    assert(hasLine('## `MyClass`'));
    assert(hasLine('this is MyClass'));
  });

  it('has constructor', ()=>{
    assert(hasLine('### `constructor()`'));
    assert(hasLine('this is constructor'));
  });

  it('has member', ()=>{
    assert(hasLine('### `member1: number`'));
    assert(hasLine('this is member1.'));
  });

  it('has method', ()=>{
    assert(hasLine('### `method1(p1: ...number): boolean`'));
    assert(hasLine('this is method1.'));
    assert(hasLine('| p1 | ...number |  | this is p1 |'));
  });
});
