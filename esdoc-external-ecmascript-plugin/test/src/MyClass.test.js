const assert = require('assert');
const path = require('path');
const fs = require('fs');

describe('test external ecmascript results:', ()=>{
  const tmp = fs.readFileSync('./test/out/index.json').toString();
  const tags = JSON.parse(tmp);

  it('has external ecmascript.', ()=>{
    const tag = tags.find(tag => tag.kind === 'external' && tag.name === 'number');
    assert.equal(tag.externalLink, "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number");
  });

  it('removed external-ecmascript.js', ()=>{
    assert.throws(()=>{
      fs.readFileSync('./test/src/.external-ecmascript.js');
    });
  });
});
