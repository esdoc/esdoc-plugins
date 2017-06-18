const assert = require('assert');
const {find, file} = require('../util');

describe('test/MyClass.js:', ()=> {
  it('has method doc', ()=>{
    const doc = find('longname', 'src/MyClass.js~MyClass#method1');
    assert(doc);
  });
});

