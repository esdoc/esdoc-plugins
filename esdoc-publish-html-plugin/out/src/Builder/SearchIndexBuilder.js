'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DocBuilder = require('./DocBuilder.js');

var _DocBuilder2 = _interopRequireDefault(_DocBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Search index of identifier builder class.
 */
class SearchIndexBuilder extends _DocBuilder2.default {
  exec(writeFile, copyDir) {
    const searchIndex = [];
    const docs = this._find({});

    for (const doc of docs) {
      if (doc.kind === 'index') continue;
      if (doc.kind.indexOf('manual') === 0) continue;

      let indexText;
      let url;
      let displayText;

      if (doc.importPath) {
        displayText = `<span>${doc.name}</span> <span class="search-result-import-path">${doc.importPath}</span>`;
        indexText = `${doc.importPath}~${doc.name}`.toLowerCase();
        url = this._getURL(doc);
      } else if (doc.kind === 'test') {
        displayText = doc.testFullDescription;
        indexText = [...(doc.testTargets || []), ...(doc._custom_test_targets || [])].join(' ').toLowerCase();
        const filePath = doc.longname.split('~')[0];
        const fileDoc = this._find({ kind: 'testFile', name: filePath })[0];
        url = `${this._getURL(fileDoc)}#lineNumber${doc.lineNumber}`;
      } else if (doc.kind === 'external') {
        displayText = doc.longname;
        indexText = displayText.toLowerCase();
        url = doc.externalLink;
      } else if (doc.kind === 'file' || doc.kind === 'testFile') {
        displayText = doc.name;
        indexText = displayText.toLowerCase();
        url = this._getURL(doc);
      } else if (doc.kind === 'packageJSON') {
        continue;
      } else {
        displayText = doc.longname;
        indexText = displayText.toLowerCase();
        url = this._getURL(doc);
      }

      let kind = doc.kind;
      /* eslint-disable default-case */
      switch (kind) {
        case 'constructor':
          kind = 'method';
          break;
        case 'get':
        case 'set':
          kind = 'member';
          break;
      }

      searchIndex.push([indexText, url, displayText, kind]);
    }

    searchIndex.sort((a, b) => {
      if (a[2] === b[2]) {
        return 0;
      } else if (a[2] < b[2]) {
        return -1;
      } else {
        return 1;
      }
    });

    const javascript = `window.esdocSearchIndex = ${JSON.stringify(searchIndex, null, 2)}`;

    writeFile('script/search_index.js', javascript);
  }
}
exports.default = SearchIndexBuilder;