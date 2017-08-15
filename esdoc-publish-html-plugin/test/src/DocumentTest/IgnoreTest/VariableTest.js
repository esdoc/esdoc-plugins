import {readDoc, assert, find, pluginOptions} from './../../util.js';

/** @test {DocResolver#_resolveIgnore */
describe('testIgnoreVariable', ()=>{

  it('is not documented.', ()=>{
    if (pluginOptions.organizePaths) {
      assert.throws(()=> readDoc('variable/index.html', 'Ignore'));
    } else {
      const doc = readDoc('variable/index.html');
      assert.throws(()=> find(doc, '[data-ice="summary"] [href$="#static-variable-testIgnoreVariable"]', ()=>{}));
      assert.throws(()=> find(doc, '[id="static-variable-testIgnoreVariable"]', ()=>{}));
    }
  });
});
