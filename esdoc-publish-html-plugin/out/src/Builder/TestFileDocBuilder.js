'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _iceCap = require('ice-cap');

var _iceCap2 = _interopRequireDefault(_iceCap);

var _DocBuilder = require('./DocBuilder.js');

var _DocBuilder2 = _interopRequireDefault(_DocBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * File output html builder class.
 */
class TestFileDocBuilder extends _DocBuilder2.default {
  exec(writeFile, copyDir) {
    const ice = this._buildLayoutDoc();

    const docs = this._find({ kind: 'testFile' });
    for (const doc of docs) {
      const fileName = this._getOutputFileName(doc);
      const baseUrl = this._getBaseUrl(fileName);
      const title = this._getTitle(doc);
      ice.load('content', this._buildFileDoc(doc), _iceCap2.default.MODE_WRITE);
      ice.attr('baseUrl', 'href', baseUrl, _iceCap2.default.MODE_WRITE);
      ice.text('title', title, _iceCap2.default.MODE_WRITE);
      writeFile(fileName, ice.html);
    }
  }

  /**
   * build file output html.
   * @param {DocObject} doc - target file doc object.
   * @returns {string} html of file output.
   * @private
   */
  _buildFileDoc(doc) {
    const ice = new _iceCap2.default(this._readTemplate('file.html'));
    ice.text('title', doc.name);
    ice.text('content', doc.content);
    ice.drop('emptySourceCode', !!doc.content);
    return ice.html;
  }
}
exports.default = TestFileDocBuilder;