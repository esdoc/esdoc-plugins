import {readDoc, assert, findParent} from './../util.js';

/** @test {IdentifiersDocBuilder} */
describe('test identifiers', ()=> {
  const doc = readDoc('identifiers.html');

  it('has Abstract summary.', ()=>{
    findParent(doc, '#abstract', '[data-ice="dirSummaryWrap"]', (doc)=>{
      assert.includes(doc, '[data-ice="dirSummary"] [data-ice="target"]:nth-of-type(1)', 'public C TestAbstractDefinition');
    });
  });

  it('has Version summary.', ()=>{
    findParent(doc, '#version', '[data-ice="dirSummaryWrap"]', (doc)=>{
      assert.includes(doc, '[data-ice="dirSummary"] [data-ice="target"]:nth-of-type(1)', 'public C TestVersionClass');
    });
  });
});
