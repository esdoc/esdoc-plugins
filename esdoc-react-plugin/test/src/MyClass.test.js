const assert = require('assert');
const {load, text} = require('../util');

describe('test/MyClass.js:', ()=> {
  it('has React props', ()=>{
    const $ = load('./test/out/class/src/MyClass.js~MyClass.html');
    const $table = $('.self-detail.detail [data-ice="properties"]');

    assert.equal(text($table, 'tbody tr:nth-child(1)'), 'prop1 number nullable: false this is prop1');
    assert.equal(text($table, 'tbody tr:nth-child(2)'), 'prop2 string this is prop2');
  });

  it('does not have React props', ()=>{
    const $ = load('./test/out/class/src/MyClass.js~NonReactClass.html');
    const $table = $('.self-detail.detail [data-ice="properties"]');

    assert.equal($table.length, 0);
  });
});

