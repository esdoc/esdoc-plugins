const assert = require('assert');
const {find} = require('../util');

describe('test/Param.js:', ()=> {
  it('infer literal param', ()=>{
    const doc = find('longname', 'src/Param.js~TestParam#methodLiteral');
    assert.deepEqual(doc.params, [
      {
        "name": "p1",
        "optional": true,
        "types": [
          "number"
        ],
        "defaultRaw": 123,
        "defaultValue": "123"
      }
    ]);
  });

  it('infer identifier param', ()=>{
    const doc = find('longname', 'src/Param.js~TestParam#methodIdentifier');
    assert.deepEqual(doc.params, [
      {
        "name": "p1",
        "optional": true,
        "types": [
          "*"
        ],
        "defaultRaw": "value",
        "defaultValue": "value"
      }
    ]);
  });

  it('infer new expression param', ()=>{
    const doc = find('longname', 'src/Param.js~TestParam#methodNewExpression');
    assert.deepEqual(doc.params, [
      {
        "name": "p1",
        "optional": true,
        "types": [
          "*"
        ]
      }
    ]);
  });

  it('infer array param', ()=>{
    const doc = find('longname', 'src/Param.js~TestParam#methodArray');
    assert.deepEqual(doc.params, [
      {
        "name": "p1",
        "optional": true,
        "types": [
          "number[]"
        ],
        "defaultRaw": [
          123,
          456
        ],
        "defaultValue": "[123,456]"
      }
    ]);
  });

  it('infer array destructuring param', ()=>{
    const doc = find('longname', 'src/Param.js~TestParam#methodArrayDestructuring');
    assert.deepEqual(doc.params, [
      {
        "name": "arrayPattern",
        "types": [
          "*[]"
        ],
        "defaultRaw": [
          "null",
          "null"
        ],
        "defaultValue": "[null, null]"
      }
    ]);
  });

  it('infer array default and destructuring param', ()=>{
    const doc = find('longname', 'src/Param.js~TestParam#methodArrayAndDestructuring');
    assert.deepEqual(doc.params, [
      {
        "name": "arrayPattern",
        "optional": true,
        "types": [
          "number[]"
        ],
        "defaultRaw": [
          123,
          456
        ],
        "defaultValue": "[123,456]"
      }
    ]);
  });

  it('infer array sparse destructuring param', ()=>{
    const doc = find('longname', 'src/Param.js~TestParam#methodArraySparseDestructuring');
    assert.deepEqual(doc.params, [
      {
        "name": "arrayPattern",
        "types": [
          "*[]"
        ],
        "defaultRaw": [
          'undefined',
          'null'
        ],
        "defaultValue": "[undefined, null]"
      }
    ]);
  });

  it('infer object param', ()=>{
    const doc = find('longname', 'src/Param.js~TestParam#methodObject');
    assert.deepEqual(doc.params, [
      {
        "name": "p1",
        "optional": true,
        "types": [
          "{\"x1\": string, \"x2\": boolean}"
        ],
        "defaultRaw": {
          "x1": "text",
          "x2": true
        },
        "defaultValue": "{\"x1\":\"text\",\"x2\":true}"
      }
    ]);
  });

  it('infer object destructuring param', ()=>{
    const doc = find('longname', 'src/Param.js~TestParam#methodObjectDestructuring');
    assert.deepEqual(doc.params, [
      {
        "name": "objectPattern",
        "types": [
          "{\"x1\": *, \"x2\": *}"
        ],
        "defaultRaw": {
          "x1": null,
          "x2": null
        },
        "defaultValue": "{\"x1\":null,\"x2\":null}"
      }
    ]);
  });

  it('infer object default and destructuring param', ()=>{
    const doc = find('longname', 'src/Param.js~TestParam#methodObjectAndDestructuring');
    assert.deepEqual(doc.params, [
      {
        "name": "objectPattern",
        "optional": true,
        "types": [
          "{\"x1\": number, \"x2\": string}"
        ],
        "defaultRaw": {
          "x1": 123,
          "x2": "text"
        },
        "defaultValue": "{\"x1\":123,\"x2\":\"text\"}"
      }
    ]);
  });

  it('infer spread param', ()=>{
    const doc = find('longname', 'src/Param.js~TestParam#methodSpread');
    assert.deepEqual(doc.params, [
      {
        "name": "p1",
        "types": [
          "...*"
        ],
        "spread": true
      }
    ]);
  });

  it('infer array destructuring and partial default param', ()=>{
    const doc = find('longname', 'src/Param.js~TestParam#methodArrayDestructuringAndPartialDefault');
    assert.deepEqual(doc.params, [
      {
        "name": "arrayPattern",
        "types": [
          "number[]"
        ],
        "defaultRaw": [
          "null",
          "10",
          "*",
          "\"text\"",
          "*"
        ],
        "defaultValue": "[null, 10, *, \"text\", *]"
      }
    ]);
  });
});

