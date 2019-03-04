'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _taffydb = require('taffydb');

var _iceCap = require('ice-cap');

var _iceCap2 = _interopRequireDefault(_iceCap);

var _DocBuilder = require('./Builder/DocBuilder');

var _DocBuilder2 = _interopRequireDefault(_DocBuilder);

var _StaticFileBuilder = require('./Builder/StaticFileBuilder.js');

var _StaticFileBuilder2 = _interopRequireDefault(_StaticFileBuilder);

var _IdentifiersDocBuilder = require('./Builder/IdentifiersDocBuilder.js');

var _IdentifiersDocBuilder2 = _interopRequireDefault(_IdentifiersDocBuilder);

var _IndexDocBuilder = require('./Builder/IndexDocBuilder.js');

var _IndexDocBuilder2 = _interopRequireDefault(_IndexDocBuilder);

var _ClassDocBuilder = require('./Builder/ClassDocBuilder.js');

var _ClassDocBuilder2 = _interopRequireDefault(_ClassDocBuilder);

var _SingleDocBuilder = require('./Builder/SingleDocBuilder.js');

var _SingleDocBuilder2 = _interopRequireDefault(_SingleDocBuilder);

var _FileDocBuilder = require('./Builder/FileDocBuilder.js');

var _FileDocBuilder2 = _interopRequireDefault(_FileDocBuilder);

var _SearchIndexBuilder = require('./Builder/SearchIndexBuilder.js');

var _SearchIndexBuilder2 = _interopRequireDefault(_SearchIndexBuilder);

var _SourceDocBuilder = require('./Builder/SourceDocBuilder.js');

var _SourceDocBuilder2 = _interopRequireDefault(_SourceDocBuilder);

var _TestDocBuilder = require('./Builder/TestDocBuilder.js');

var _TestDocBuilder2 = _interopRequireDefault(_TestDocBuilder);

var _TestFileDocBuilder = require('./Builder/TestFileDocBuilder.js');

var _TestFileDocBuilder2 = _interopRequireDefault(_TestFileDocBuilder);

var _ManualDocBuilder = require('./Builder/ManualDocBuilder.js');

var _ManualDocBuilder2 = _interopRequireDefault(_ManualDocBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Plugin {
  onHandleDocs(ev) {
    this._docs = ev.data.docs;
  }

  onPublish(ev) {
    this._option = ev.data.option || {};
    this._template = typeof this._option.template === 'string' ? _path2.default.resolve(process.cwd(), this._option.template) : _path2.default.resolve(__dirname, './Builder/template');
    this._exec(this._docs, ev.data.writeFile, ev.data.copyDir, ev.data.readFile);
  }

  _exec(tags, writeFile, copyDir, readFile) {
    _iceCap2.default.debug = !!this._option.debug;

    const data = (0, _taffydb.taffy)(tags);

    //bad hack: for other plugin uses builder.
    _DocBuilder2.default.createDefaultBuilder = () => {
      return new _DocBuilder2.default(this._template, data, tags);
    };

    let coverage = null;
    try {
      coverage = JSON.parse(readFile('coverage.json'));
    } catch (e) {
      // nothing
    }

    new _IdentifiersDocBuilder2.default(this._template, data, tags).exec(writeFile, copyDir);
    new _IndexDocBuilder2.default(this._template, data, tags).exec(writeFile, copyDir);
    new _ClassDocBuilder2.default(this._template, data, tags).exec(writeFile, copyDir);
    new _SingleDocBuilder2.default(this._template, data, tags).exec(writeFile, copyDir);
    new _FileDocBuilder2.default(this._template, data, tags).exec(writeFile, copyDir);
    new _StaticFileBuilder2.default(this._template, data, tags).exec(writeFile, copyDir);
    new _SearchIndexBuilder2.default(this._template, data, tags).exec(writeFile, copyDir);
    new _SourceDocBuilder2.default(this._template, data, tags).exec(writeFile, copyDir, coverage);
    new _ManualDocBuilder2.default(this._template, data, tags).exec(writeFile, copyDir, readFile);

    const existTest = tags.find(tag => tag.kind.indexOf('test') === 0);
    if (existTest) {
      new _TestDocBuilder2.default(this._template, data, tags).exec(writeFile, copyDir);
      new _TestFileDocBuilder2.default(this._template, data, tags).exec(writeFile, copyDir);
    }
  }
}

module.exports = new Plugin();