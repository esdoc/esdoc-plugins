const assert = require('assert');
const {find} = require('../util');

describe('test/MyClass.js:', ()=> {
  it('can parse jsx', ()=>{
    const doc = find('longname', 'src/MyClass.js~MyClass#method');
    assert(doc);
  });
});

