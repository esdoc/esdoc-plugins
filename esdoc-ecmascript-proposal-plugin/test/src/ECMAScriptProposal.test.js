const assert = require('assert');
const {find, file} = require('../util');

describe('test ecmascript proposal result:', ()=> {
  it('parses AsyncGenerators', ()=>{
    const doc = find('longname', 'src/AsyncGenerators.js~AsyncGenerators#method');
    assert(doc);
  });

  it('parses ClassProperties', ()=>{
    let doc = find('longname', 'src/ClassProperties.js~ClassProperties.p1');
    assert.equal(doc.static, true);
    assert.equal(doc.type.types[0], 'number');

    doc = find('longname', 'src/ClassProperties.js~ClassProperties#p1');
    assert.equal(doc.static, false);
    assert.equal(doc.type.types[0], 'number');
  });

  it('parses Decorators', ()=>{
    let doc = find('longname', 'src/Decorators.js~Decorators');
    assert.deepEqual(doc.decorators, [{name: 'annotation1', arguments: null}]);

    doc = find('longname', 'src/Decorators.js~Decorators.method1');
    assert.deepEqual(doc.decorators, [{name: 'annotation1', arguments: null}]);

    doc = find('longname', 'src/Decorators.js~Decorators#value1');
    assert.deepEqual(doc.decorators, [{name: 'annotation1', arguments: null}]);

    doc = find('longname', 'src/Decorators.js~Decorators#value2');
    assert.deepEqual(doc.decorators, [{name: 'annotation1', arguments: null}]);

    doc = find('longname', 'src/Decorators.js~Decorators#method1');
    assert.deepEqual(doc.decorators, [{name: 'annotation1', arguments: null}, {name: 'annotation2', arguments: '(true)'}]);

    doc = find('longname', 'src/Decorators.js~Decorators#method2');
    assert.deepEqual(doc.decorators, [{name: 'annotation1.bar', arguments: null}, {name: 'annotation1.foo', arguments: '(1, 2)'}]);
  });

  it('parses DoExpressions', ()=>{
    const doc = find('longname', 'src/DoExpressions.js~DoExpressions');
    assert(doc);
  });

  it('parses DynamicImport', ()=>{
    const doc = find('longname', 'src/DynamicImport.js~DynamicImport');
    assert(doc);
  });

  it('parses ExportExtensions', ()=>{
    const doc = find('longname', 'src/ExportExtensions.js~ExportExtensions');
    assert(doc);
  });

  it('parses FunctionBind', ()=>{
    const doc = find('longname', 'src/FunctionBind.js~FunctionBind');
    assert(doc);
  });

  it('parses FunctionSent', ()=>{
    const doc = find('longname', 'src/FunctionSent.js~FunctionSent');
    assert(doc);
  });

  it('parses ObjectRestSpread', ()=>{
    let doc = find('longname', 'src/ObjectRestSpread.js~ObjectRestSpread#method1');
    assert.deepEqual(doc.params, [
      {
        "nullable": null,
        "types": [
          "Object"
        ],
        "spread": false,
        "optional": false,
        "name": "config",
        "description": "this is config."
      },
      {
        "nullable": null,
        "types": [
          "number"
        ],
        "spread": false,
        "optional": false,
        "name": "config.x",
        "description": "this is number x."
      },
      {
        "nullable": null,
        "types": [
          "string"
        ],
        "spread": false,
        "optional": false,
        "name": "config.y",
        "description": "this is string y."
      },
      {
        "nullable": null,
        "types": [
          "number[]"
        ],
        "spread": false,
        "optional": false,
        "name": "config.a",
        "description": "thi is number[] a."
      },
      {
        "nullable": null,
        "types": [
          "string[]"
        ],
        "spread": false,
        "optional": false,
        "name": "config.b",
        "description": "thi is number[] b."
      }
    ]);

    doc = find('longname', 'src/ObjectRestSpread.js~ObjectRestSpread#method2');
    assert.deepEqual(doc.return, {
      "nullable": null,
      "types": [
        "{a: number, b: string, c: boolean}"
      ],
      "spread": false,
      "description": ""
    });
  });
});

