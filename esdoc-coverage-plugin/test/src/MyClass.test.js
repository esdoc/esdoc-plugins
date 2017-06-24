const assert = require('assert');
const fs = require('fs');

describe('test/MyClass.js:', ()=> {
  it('has coverage', ()=>{
    const tmp = fs.readFileSync('./test/out/coverage.json').toString();
    const coverage = JSON.parse(tmp);

    assert.equal(coverage.coverage, '80%');
    assert.equal(coverage.expectCount, 5);
    assert.equal(coverage.actualCount, 4);
    assert.deepEqual(coverage.files, {
      'src/MyClass.js': {
        expectCount: 5,
        actualCount: 4,
        undocumentLines: [21]
      }
    });
  });

  it('has coverage badge', ()=> {
    const badge = fs.readFileSync('./test/out/badge.svg').toString();
    assert(badge.includes('80%'));
  });
});

