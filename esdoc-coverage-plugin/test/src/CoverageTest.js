const assert = require('assert');
const path = require('path');
const fs = require('fs');
const ESDocCLI = require('esdoc/out/src/ESDocCLI.js').default;

function cli() {
  const cliPath = path.resolve('./node_modules/esdoc/out/ESDocCLI.js');
  const argv = ['node', cliPath, '-c', './test/fixture/esdoc.json'];
  const cli = new ESDocCLI(argv);
  cli.exec();
}

cli();

describe('test coverage result:', ()=> {
  it('has coverage', ()=>{
    const tmp = fs.readFileSync('./test/fixture/out/coverage.json').toString();
    const coverage = JSON.parse(tmp);

    assert.equal(coverage.coverage, '80%');
    assert.equal(coverage.expectCount, 5);
    assert.equal(coverage.actualCount, 4);
    assert.deepEqual(coverage.files, {
      'src/TestCoverage.js': {
        expectCount: 5,
        actualCount: 4,
        undocumentLines: [21]
      }
    });
  });

  it('has coverage badge', ()=> {
    const badge = fs.readFileSync('./test/fixture/out/badge.svg').toString();
    assert(badge.includes('80%'));
  });
});

