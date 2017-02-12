const assert = require('assert');
const path = require('path');
const ESDocCLI = require('esdoc/out/src/ESDocCLI.js').default;
const results = require('../../src/LintPlugin')._resultsForTest;

function cli() {
  const cliPath = path.resolve('./node_modules/esdoc/out/ESDocCLI.js');
  const argv = ['node', cliPath, '-c', './test/fixture/esdoc.json'];
  const cli = new ESDocCLI(argv);
  cli.exec();
}

cli();

describe('test lint results:', ()=>{
  it('has 4 lint errors.', ()=>{
    assert.equal(results.length, 4);
    assert.equal(results[0].doc.longname, 'src/TestLintInvalid.js~TestLintInvalid#method1');
    assert.equal(results[1].doc.longname, 'src/TestLintInvalid.js~TestLintInvalid#method2');
    assert.equal(results[2].doc.longname, 'src/TestLintInvalid.js~TestLintInvalid#method3');
    assert.equal(results[3].doc.longname, 'src/TestLintInvalid.js~TestLintInvalid#method4');
  });
});
