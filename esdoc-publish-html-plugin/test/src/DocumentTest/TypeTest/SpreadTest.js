import {readDoc, assert, findParent} from './../../util.js';

/**
 * @test {ParamParser#parseParamValue}
 * @test {ParamParser#parseParam}
 */
describe('TestTypeSpread', ()=> {
  const doc = readDoc('class/src/Type/Spread.js~TestTypeSpread.html', 'Type');

  it('has spread type.', ()=> {
    findParent(doc, '[data-ice="summary"] [href$="#instance-method-method1"]', '[data-ice="target"]', (doc)=> {
      assert.includes(doc, null, 'method1(p1: ...number)');
      assert.multiIncludes(doc, '[data-ice="signature"] a', [
        'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number'
      ], 'href');
    });
  });

  it('has object spread type.', ()=> {
    findParent(doc, '[data-ice="summary"] [href$="#instance-method-method2"]', '[data-ice="target"]', (doc)=> {
      assert.includes(doc, null, 'method2(config: Object)');
      assert.multiIncludes(doc, '[data-ice="signature"] a', [
        'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object'
      ], 'href');
    });
  });
});
