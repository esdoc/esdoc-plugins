'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _iceCap = require('ice-cap');

var _iceCap2 = _interopRequireDefault(_iceCap);

var _DocBuilder = require('./DocBuilder.js');

var _DocBuilder2 = _interopRequireDefault(_DocBuilder);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Identifier output builder class.
 */
class IdentifiersDocBuilder extends _DocBuilder2.default {
  exec(writeFile, copyDir) {
    const ice = this._buildLayoutDoc();
    const title = this._getTitle('Reference');
    ice.load('content', this._buildIdentifierDoc());
    ice.text('title', title, _iceCap2.default.MODE_WRITE);
    writeFile('identifiers.html', ice.html);
  }

  /**
   * build identifier output.
   * @return {IceCap} built output.
   * @private
   */
  _buildIdentifierDoc() {
    const ice = new _iceCap2.default(this._readTemplate('identifiers.html'));

    // traverse docs and create Map<dirPath, doc[]>
    const dirDocs = new Map();
    const kinds = ['class', 'interface', 'function', 'variable', 'typedef', 'external'];
    for (const doc of this._tags) {
      if (!kinds.includes(doc.kind)) continue;
      if (doc.builtinExternal) continue;
      if (doc.ignore) continue;

      const filePath = doc.memberof.replace(/^.*?[/]/, '');
      const dirPath = _path2.default.dirname(filePath);
      if (!dirDocs.has(dirPath)) dirDocs.set(dirPath, []);
      dirDocs.get(dirPath).push(doc);
    }

    // create a summary of dir
    const dirPaths = Array.from(dirDocs.keys()).sort((a, b) => a > b ? 1 : -1);
    const kindOrder = { class: 0, interface: 1, function: 2, variable: 3, typedef: 4, external: 5 };
    ice.loop('dirSummaryWrap', dirPaths, (i, dirPath, ice) => {
      const docs = dirDocs.get(dirPath);

      // see: DocBuilder#_buildNavDoc
      docs.sort((a, b) => {
        const kindA = a.interface ? 'interface' : a.kind;
        const kindB = b.interface ? 'interface' : b.kind;
        if (kindA === kindB) {
          return a.longname > b.longname ? 1 : -1;
        } else {
          return kindOrder[kindA] > kindOrder[kindB] ? 1 : -1;
        }
      });

      const dirPathLabel = dirPath === '.' ? '' : dirPath;
      const summary = this._buildSummaryDoc(docs, `summary`, false, true);
      ice.text('dirPath', dirPathLabel);
      ice.attr('dirPath', 'id', (0, _util.escapeURLHash)(dirPath));
      ice.load('dirSummary', summary);
    });

    const dirTree = this._buildDirTree(dirPaths);
    ice.load('dirTree', dirTree);
    ice.drop('dirTreeWrap', !dirTree);

    return ice;
  }

  _buildDirTree(dirPaths) {
    const lines = [];
    for (const dirPath of dirPaths) {
      const padding = dirPath.split('/').length - 1;
      const dirName = _path2.default.basename(dirPath);
      if (dirName === '.') continue;
      const hash = (0, _util.escapeURLHash)(dirPath);
      lines.push(`<div style="padding-left: ${padding}em"><a href="#${hash}">${dirName}</a></div>`);
    }

    return lines.join('\n');
  }
}
exports.default = IdentifiersDocBuilder;