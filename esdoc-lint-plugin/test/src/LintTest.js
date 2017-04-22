const assert = require('assert');
const fs = require('fs');
const path = require('path');
const ESDocCLI = require('esdoc/out/src/ESDocCLI.js').default;

function cli() {
  const cliPath = path.resolve('./node_modules/esdoc/out/ESDocCLI.js');
  const argv = ['node', cliPath, '-c', './test/fixture/esdoc.json'];
  const cli = new ESDocCLI(argv);
  cli.exec();
}

cli();

describe('test lint results:', ()=>{
  const tmp = fs.readFileSync('./test/fixture/out/lint.json').toString();
  const lintResults = JSON.parse(tmp);

  it('has 4 lint errors.', ()=>{
    assert.equal(lintResults.length, 4);
    assert.equal(lintResults[0].name, 'TestLintInvalid#method1');
    assert.equal(lintResults[1].name, 'TestLintInvalid#method2');
    assert.equal(lintResults[2].name, 'TestLintInvalid#method3');
    assert.equal(lintResults[3].name, 'TestLintInvalid#method4');
  });
});
