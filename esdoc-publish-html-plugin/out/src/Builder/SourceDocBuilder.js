'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _iceCap = require('ice-cap');

var _iceCap2 = _interopRequireDefault(_iceCap);

var _DocBuilder = require('./DocBuilder.js');

var _DocBuilder2 = _interopRequireDefault(_DocBuilder);

var _util = require('./util.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source output html builder class.
 */
class SourceDocBuilder extends _DocBuilder2.default {
  exec(writeFile, copyDir, coverage) {
    this._coverage = coverage;
    const ice = this._buildLayoutDoc();
    const fileName = 'source.html';
    const baseUrl = this._getBaseUrl(fileName);
    const title = this._getTitle('Source');

    ice.attr('baseUrl', 'href', baseUrl);
    ice.load('content', this._buildSourceHTML());
    ice.text('title', title, _iceCap2.default.MODE_WRITE);

    writeFile(fileName, ice.html);
  }

  /**
   * build source list output html.
   * @returns {string} html of source list.
   * @private
   */
  _buildSourceHTML() {
    const ice = new _iceCap2.default(this._readTemplate('source.html'));
    const docs = this._find({ kind: 'file' });
    let coverage;
    if (this._coverage) coverage = this._coverage.files;

    ice.drop('coverageBadge', !coverage);
    ice.attr('files', 'data-use-coverage', !!coverage);

    if (coverage) {
      const actual = this._coverage.actualCount;
      const expect = this._coverage.expectCount;
      const coverageCount = `${actual}/${expect}`;
      ice.text('totalCoverageCount', coverageCount);
    }

    ice.loop('file', docs, (i, doc, ice) => {
      const filePath = doc.name;
      const content = doc.content;
      const lines = content.split('\n').length - 1;
      const stat = _fs2.default.statSync(doc.longname);
      const date = (0, _util.dateForUTC)(stat.ctime);
      let coverageRatio;
      let coverageCount;
      let undocumentLines;
      if (coverage && coverage[filePath]) {
        const actual = coverage[filePath].actualCount;
        const expect = coverage[filePath].expectCount;
        coverageRatio = `${Math.floor(100 * actual / expect)} %`;
        coverageCount = `${actual}/${expect}`;
        undocumentLines = coverage[filePath].undocumentLines.sort().join(',');
      } else {
        coverageRatio = '-';
      }

      const identifierDocs = this._find({
        longname: { left: `${doc.name}~` },
        kind: ['class', 'function', 'variable']
      });
      const identifiers = identifierDocs.map(doc => {
        return this._buildDocLinkHTML(doc.longname);
      });

      if (undocumentLines) {
        const url = this._getURL(doc);
        const link = this._buildFileDocLinkHTML(doc).replace(/href=".*\.html"/, `href="${url}#errorLines=${undocumentLines}"`);
        ice.load('filePath', link);
      } else {
        ice.load('filePath', this._buildFileDocLinkHTML(doc));
      }
      ice.text('coverage', coverageRatio);
      ice.text('coverageCount', coverageCount);
      ice.text('lines', lines);
      ice.text('updated', date);
      ice.text('size', `${stat.size} byte`);
      ice.load('identifier', identifiers.join('\n') || '-');
    });
    return ice.html;
  }
}
exports.default = SourceDocBuilder;