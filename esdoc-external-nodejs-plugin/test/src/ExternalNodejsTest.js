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

describe('test external Node.js results:', ()=>{
  const tmp = fs.readFileSync('./test/fixture/out/dump.json').toString();
  const tags = JSON.parse(tmp);

  it('has external Node.js.', ()=>{
    const tag = tags.find(tag => tag.kind === 'external' && tag.name === 'http~ClientRequest');
    assert.equal(tag.externalLink, "https://nodejs.org/dist/latest/docs/api/http.html#http_class_http_clientrequest");
  });

  it('removed external-nodejs.js', ()=>{
    assert.throws(()=>{
      fs.readFileSync('./test/fixture/src/.external-nodejs.js');
    });
  });
});
