const assert = require('assert');
const {find} = require('../util');

describe('test/MyClass.js:', ()=>{

  it('has external web api.', ()=>{
    const doc = find('name', 'XMLHttpRequest');
    assert.equal(doc.externalLink, 'https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest');
  });

  it('removed external-webapi.js', ()=>{
    assert.throws(()=>{
      fs.readFileSync('./test/src/.external-webapi.js');
    });
  });
});
