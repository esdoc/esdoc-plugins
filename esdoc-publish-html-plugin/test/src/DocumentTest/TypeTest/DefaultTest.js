import {readDoc, assert, findParent} from './../../util.js';

/**
 * @test {ParamParser#parseParamValue}
 * @test {ParamParser#parseParam}
 */
describe('TestTypeDefault', ()=> {
  const doc = readDoc('class/src/Type/Default.js~TestTypeDefault.html', 'Type');

  it('has default value.', ()=>{
    findParent(doc, '[id="instance-method-method1"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '.params [data-ice="property"]:nth-child(1)', 'optional default: 123');
      assert.includes(doc, '.params [data-ice="property"]:nth-child(2)', 'optional default: []');
    });
  });

  it('has default value of object.', ()=>{
    findParent(doc, '[id="instance-method-method2"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '.params [data-ice="property"]:nth-child(1)', 'optional default: new Foo()');
    });
  });
});
