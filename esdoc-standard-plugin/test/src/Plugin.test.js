const assert = require('assert');
const path = require('path');

describe('test standard plugin:', ()=>{
  it('dynamically load plugins', ()=>{
    const plugins = require('../spy-plugin.js').testTargetPlugins;

    assert.deepEqual(plugins, [
      {name: './src/Plugin.js', option: {
        brand: {
          title: 'My Library'
        },
        manual: {
          files: ['./test/manual/overview.md']
        },
        test: {
          source: "./test/test",
          includes: ["Test.js$"]
        }
      }},
      {name: './test/spy-plugin.js'},
      {name: 'esdoc-latest-lint-plugin'},
      {name: 'esdoc-latest-coverage-plugin'},
      {name: 'esdoc-latest-accessor-plugin'},
      {name: 'esdoc-latest-type-inference-plugin'},
      {name: 'esdoc-latest-external-ecmascript-plugin'},
      {name: 'esdoc-latest-brand-plugin', option: {title: 'My Library'}},
      {name: 'esdoc-latest-undocumented-identifier-plugin'},
      {name: 'esdoc-latest-unexported-identifier-plugin'},
      {name: 'esdoc-latest-integrate-manual-plugin', option: {
        coverage: true,
        files: ['./test/manual/overview.md']
      }},
      {name: 'esdoc-latest-integrate-test-plugin', option: {
        source: "./test/test",
        interfaces: ["describe", "it", "context", "suite", "test"],
        includes: ["Test.js$"],
        excludes: ["\\.config\\.js$"]
      }},
      {name: 'esdoc-latest-publish-html-plugin'},
    ]);

  });
});
