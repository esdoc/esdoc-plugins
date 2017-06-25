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
      {name: 'esdoc-lint-plugin'},
      {name: 'esdoc-coverage-plugin'},
      {name: 'esdoc-accessor-plugin'},
      {name: 'esdoc-type-inference-plugin'},
      {name: 'esdoc-external-ecmascript-plugin'},
      {name: 'esdoc-brand-plugin', option: {title: 'My Library'}},
      {name: 'esdoc-undocumented-identifier-plugin'},
      {name: 'esdoc-unexported-identifier-plugin'},
      {name: 'esdoc-integrate-manual-plugin', option: {
        coverage: true,
        files: ['./test/manual/overview.md']
      }},
      {name: 'esdoc-integrate-test-plugin', option: {
        source: "./test/test",
        interfaces: ["describe", "it", "context", "suite", "test"],
        includes: ["Test.js$"],
        excludes: ["\\.config\\.js$"]
      }},
      {name: 'esdoc-publish-html-plugin'},
    ]);

  });
});
