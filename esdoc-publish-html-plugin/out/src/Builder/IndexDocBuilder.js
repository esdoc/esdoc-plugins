'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _iceCap = require('ice-cap');

var _iceCap2 = _interopRequireDefault(_iceCap);

var _DocBuilder = require('./DocBuilder.js');

var _DocBuilder2 = _interopRequireDefault(_DocBuilder);

var _util = require('./util.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Index output builder class.
 */
class IndexDocBuilder extends _DocBuilder2.default {
  exec(writeFile, copyDir) {
    const ice = this._buildLayoutDoc();
    const title = this._getTitle('Home');
    ice.load('content', this._buildIndexDoc());
    ice.text('title', title, _iceCap2.default.MODE_WRITE);
    writeFile('index.html', ice.html);
  }

  /**
   * build index output.
   * @returns {string} html of index output.
   * @private
   */
  _buildIndexDoc() {
    const indexTag = this._tags.find(tag => tag.kind === 'index');
    if (!indexTag) return 'Please create README.md';

    const indexContent = indexTag.content;

    const html = this._readTemplate('index.html');
    const ice = new _iceCap2.default(html);
    const ext = _path2.default.extname(indexTag.name);
    if (['.md', '.markdown'].includes(ext)) {
      ice.load('index', (0, _util.markdown)(indexContent));
    } else {
      ice.load('index', indexContent);
    }

    return ice.html;
  }
}
exports.default = IndexDocBuilder;