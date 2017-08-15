import {readDoc, assert, find, pluginOptions} from './../../util.js';

/** @test {DocResolver#_resolveIgnore */
describe('testIgnoreFunction', ()=>{

  it('is not documented.', ()=>{
    if (pluginOptions.organizePaths) {
      assert.throws(()=> readDoc('function/index.html', 'Ignore'));
    } else {
      const doc = readDoc('function/index.html');
      assert.throws(()=> find(doc, '[data-ice="summary"] [href$="#static-function-testIgnoreFunction"]', ()=>{}));
      assert.throws(()=> find(doc, '[id="static-function-testIgnoreFunction"]', ()=>{}));
    }
  });
});
