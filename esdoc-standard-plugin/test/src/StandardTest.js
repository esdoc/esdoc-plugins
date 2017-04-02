const assert = require('assert');
const path = require('path');
const ESDocCLI = require('esdoc/out/src/ESDocCLI.js').default;

function cli() {
  const cliPath = path.resolve('./node_modules/esdoc/out/ESDocCLI.js');
  const argv = ['node', cliPath, '-c', './test/fixture/esdoc.json'];
  const cli = new ESDocCLI(argv);
  cli.exec();
}

cli();

describe('test standard plugin:', ()=>{
  it('dynamically load plugins', ()=>{
    const plugins = require('../fixture/spy-plugin.js').testTargetPlugins;

    assert.equal(plugins.length, 9);

    assert.equal(plugins[0].name, './src/index.js');
    assert.equal(plugins[1].name, './test/fixture/spy-plugin.js');
    assert.equal(plugins[2].name, 'esdoc-lint-plugin');
    assert.equal(plugins[3].name, 'esdoc-coverage-plugin');
    assert.equal(plugins[4].name, 'esdoc-accessor-plugin');
    assert.equal(plugins[5].name, 'esdoc-external-ecmascript-plugin');
    assert.equal(plugins[6].name, 'esdoc-brand-plugin');
    assert.equal(plugins[7].name, 'esdoc-undocumented-identifier-plugin');
    assert.equal(plugins[8].name, 'esdoc-publish-html-plugin');
  });
});
