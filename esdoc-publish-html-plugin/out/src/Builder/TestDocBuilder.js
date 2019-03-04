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
 * Test file output html builder class.
 */
class TestDocBuilder extends _DocBuilder2.default {
  exec(writeFile, copyDir) {
    const testDoc = this._find({ kind: 'test' })[0];
    if (!testDoc) return;

    const ice = this._buildLayoutDoc();
    const fileName = this._getOutputFileName(testDoc);
    const baseUrl = this._getBaseUrl(fileName);
    const title = this._getTitle('Test');

    ice.load('content', this._buildTestDocHTML());
    ice.attr('baseUrl', 'href', baseUrl);
    ice.text('title', title);
    writeFile(fileName, ice.html);
  }

  /**
   * build whole test file output html.
   * @returns {string} html of whole test file.
   * @private
   */
  _buildTestDocHTML() {
    const ice = new _iceCap2.default(this._readTemplate('test.html'));
    const testDocHTML = this._buildTestInterfaceDocHTML();
    ice.load('tests', testDocHTML);
    return ice.html;
  }

  /**
   * build test describe list html.
   * @param {number} [depth=0] - test depth.
   * @param {string} [memberof] - target test.
   * @returns {string} html of describe list.
   * @private
   */
  _buildTestInterfaceDocHTML(depth = 0, memberof = null) {
    const cond = { kind: 'test', testDepth: depth };
    if (memberof) cond.memberof = memberof;
    const docs = this._orderedFind('testId asec', cond);

    const resultHTMLs = [];
    for (const doc of docs) {
      const childHTML = this._buildTestInterfaceDocHTML(depth + 1, doc.longname);

      const ice = new _iceCap2.default(this._readTemplate('testInterface.html'));
      const padding = 10 * (depth + 1);
      ice.attr('testInterface', 'data-test-depth', depth);
      ice.into('testInterface', doc, (doc, ice) => {
        // description
        const descriptionHTML = this._buildFileDocLinkHTML(doc, doc.description);

        // identifier
        let testTargetsHTML = [];
        for (const testTarget of doc._custom_test_targets || []) {
          testTargetsHTML.push(this._buildDocLinkHTML(testTarget[0], testTarget[1]));
        }
        testTargetsHTML = testTargetsHTML.join('\n') || '-';

        // apply
        ice.drop('testInterfaceToggle', !childHTML);
        ice.load('testDescription', descriptionHTML);
        ice.attr('testDescription', 'style', `padding-left: ${padding}px`);
        ice.load('testTarget', testTargetsHTML);
      });

      resultHTMLs.push(ice.html);
      if (childHTML) resultHTMLs.push(childHTML);
    }

    return resultHTMLs.join('\n');
  }
}
exports.default = TestDocBuilder;