const assert = require('assert');
const {find, file} = require('../util');

describe('test/Template.js:', ()=> {
  it('has method doc', ()=>{
    const doc = find('longname', 'src/TestTemplate.js~TestTemplate#method1');
    assert(doc);
  });
});

