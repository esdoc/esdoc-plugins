const assert = require('assert');
const path = require('path');
const fs = require('fs');
const ESDocCLI = require('esdoc/out/src/ESDocCLI.js').default;

function cli() {
  const cliPath = path.resolve('./node_modules/esdoc/out/ESDocCLI.js');
  const argv = ['node', cliPath, '-c', './test/fixture/esdoc.json'];
  const cli = new ESDocCLI(argv);
  cli.exec();
}

cli();

describe('test ecmascript proposal result:', ()=> {
  const tmp = fs.readFileSync('./test/fixture/out/dump.json').toString();
  const docs = JSON.parse(tmp);

  it('parses AsyncGenerators', ()=>{
    const doc = docs.find(doc => doc.longname === 'src/AsyncGenerators.js~AsyncGenerators#method');
    assert(doc);
  });

  it('parses ClassProperties', ()=>{
    let doc = docs.find(doc => doc.longname === 'src/ClassProperties.js~ClassProperties.p1');
    assert.equal(doc.static, true);
    assert.equal(doc.type.types[0], 'number');

    doc = docs.find(doc => doc.longname === 'src/ClassProperties.js~ClassProperties#p1');
    assert.equal(doc.static, false);
    assert.equal(doc.type.types[0], 'number');
  });

  it('parses Decorators', ()=>{
    let doc = docs.find(doc => doc.longname === 'src/Decorators.js~Decorators');
    assert.deepEqual(doc.decorators, [{name: 'annotation1', arguments: null}]);

    doc = docs.find(doc => doc.longname === 'src/Decorators.js~Decorators.method1');
    assert.deepEqual(doc.decorators, [{name: 'annotation1', arguments: null}]);

    doc = docs.find(doc => doc.longname === 'src/Decorators.js~Decorators#value1' && doc.kind === 'get');
    assert.deepEqual(doc.decorators, [{name: 'annotation1', arguments: null}]);

    doc = docs.find(doc => doc.longname === 'src/Decorators.js~Decorators#value2' && doc.kind === 'set');
    assert.deepEqual(doc.decorators, [{name: 'annotation1', arguments: null}]);

    doc = docs.find(doc => doc.longname === 'src/Decorators.js~Decorators#method1');
    assert.deepEqual(doc.decorators, [{name: 'annotation1', arguments: null}, {name: 'annotation2', arguments: '(true)'}]);
  });

  it('parses DoExpressions', ()=>{
    const doc = docs.find(doc => doc.longname === 'src/DoExpressions.js~DoExpressions');
    assert(doc);
  });

  it('parses DynamicImport', ()=>{
    const doc = docs.find(doc => doc.longname === 'src/DynamicImport.js~DynamicImport');
    assert(doc);
  });

  it('parses ExportExtensions', ()=>{
    const doc = docs.find(doc => doc.longname === 'src/ExportExtensions.js~ExportExtensions');
    assert(doc);
  });

  it('parses FunctionBind', ()=>{
    const doc = docs.find(doc => doc.longname === 'src/FunctionBind.js~FunctionBind');
    assert(doc);
  });

  it('parses FunctionSent', ()=>{
    const doc = docs.find(doc => doc.longname === 'src/FunctionSent.js~FunctionSent');
    assert(doc);
  });

  it('parses ObjectRestSpread', ()=>{
    const doc = docs.find(doc => doc.longname === 'src/ObjectRestSpread.js~ObjectRestSpread#method1');
    assert.deepEqual(doc.params, [
      {
        name: 'objectPattern',
        types: ['{"x": *, "y": *, ...z: Object}'],
        defaultRaw: {x: null, y: null, z: {} },
        defaultValue: '{"x":null,"y":null,"z":{}}'
      }
    ]);
  });
});

