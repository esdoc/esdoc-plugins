'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _iceCap = require('ice-cap');

var _iceCap2 = _interopRequireDefault(_iceCap);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _buffer = require('buffer');

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _DocBuilder = require('./DocBuilder.js');

var _DocBuilder2 = _interopRequireDefault(_DocBuilder);

var _util = require('./util.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Manual Output Builder class.
 */
class ManualDocBuilder extends _DocBuilder2.default {
  exec(writeFile, copyDir, readFile) {

    const manuals = this._tags.filter(tag => tag.kind === 'manual');
    const manualIndex = this._tags.find(tag => tag.kind === 'manualIndex');
    const manualAsset = this._tags.find(tag => tag.kind === 'manualAsset');

    if (manuals.length === 0) return;

    const ice = this._buildLayoutDoc();
    ice.autoDrop = false;
    ice.attr('rootContainer', 'class', ' manual-root');

    {
      const fileName = 'manual/index.html';
      const baseUrl = this._getBaseUrl(fileName);
      const badge = this._writeBadge(manuals, writeFile);
      ice.load('content', this._buildManualCardIndex(manuals, manualIndex, badge), _iceCap2.default.MODE_WRITE);
      ice.load('nav', this._buildManualNav(manuals), _iceCap2.default.MODE_WRITE);
      ice.text('title', 'Manual', _iceCap2.default.MODE_WRITE);
      ice.attr('baseUrl', 'href', baseUrl, _iceCap2.default.MODE_WRITE);
      ice.attr('rootContainer', 'class', ' manual-index');
      writeFile(fileName, ice.html);

      if (manualIndex.globalIndex) {
        ice.attr('baseUrl', 'href', './', _iceCap2.default.MODE_WRITE);
        writeFile('index.html', ice.html);
      }

      ice.attr('rootContainer', 'class', ' manual-index', _iceCap2.default.MODE_REMOVE);
    }

    for (const manual of manuals) {
      const fileName = this._getManualOutputFileName(manual.name, manual.destPrefix);
      const baseUrl = this._getBaseUrl(fileName);
      ice.load('content', this._buildManual(manual), _iceCap2.default.MODE_WRITE);
      ice.load('nav', this._buildManualNav(manuals), _iceCap2.default.MODE_WRITE);
      ice.attr('baseUrl', 'href', baseUrl, _iceCap2.default.MODE_WRITE);
      writeFile(fileName, ice.html);
    }

    if (manualAsset) {
      copyDir(manualAsset.name, 'manual/asset');
    }
  }

  /**
   * this is
   * @param {manual[]} manuals
   * @param {function(filePath:string, content:string)} writeFile
   * @returns {boolean}
   * @private
   */
  _writeBadge(manuals, writeFile) {
    const specialFileNamePatterns = ['(overview.*)', '(design.*)', '(installation.*)|(install.*)', '(usage.*)', '(configuration.*)|(config.*)', '(example.*)', '(faq.*)', '(changelog.*)'];

    let count = 0;
    for (const pattern of specialFileNamePatterns) {
      const regexp = new RegExp(pattern, 'i');
      for (const manual of manuals) {
        const fileName = _path2.default.parse(manual.name).name;
        if (fileName.match(regexp)) {
          count++;
          break;
        }
      }
    }

    if (count !== specialFileNamePatterns.length) return false;

    let badge = this._readTemplate('image/manual-badge.svg');
    badge = badge.replace(/@value@/g, 'perfect');
    badge = badge.replace(/@color@/g, '#4fc921');
    writeFile('manual-badge.svg', badge);

    return true;
  }

  /**
   * build manual navigation.
   * @param {Manual[]} manuals - target manuals.
   * @return {IceCap} built navigation
   * @private
   */
  _buildManualNav(manuals) {
    const ice = new _iceCap2.default(this._readTemplate('manualIndex.html'));

    ice.loop('manual', manuals, (i, manual, ice) => {
      const toc = [];
      const fileName = this._getManualOutputFileName(manual.name, manual.destPrefix);
      const html = (0, _util.markdown)(manual.content);
      const $root = _cheerio2.default.load(html).root();
      const h1Count = $root.find('h1').length;

      $root.find('h1,h2,h3,h4,h5').each((i, el) => {
        const $el = (0, _cheerio2.default)(el);
        const label = $el.text();
        const indent = `indent-${el.tagName.toLowerCase()}`;

        let link = `${fileName}#${$el.attr('id')}`;
        if (el.tagName.toLowerCase() === 'h1' && h1Count === 1) link = fileName;

        toc.push({ label, link, indent });
      });

      ice.loop('manualNav', toc, (i, tocItem, ice) => {
        ice.attr('manualNav', 'class', tocItem.indent);
        ice.attr('manualNav', 'data-link', tocItem.link.split('#')[0]);
        ice.text('link', tocItem.label);
        ice.attr('link', 'href', tocItem.link);
      });
    });

    return ice;
  }

  /**
   * build manual.
   * @param {Object} manual - target manual.
   * @return {IceCap} built manual.
   * @private
   */
  _buildManual(manual) {
    const html = (0, _util.markdown)(manual.content);
    const ice = new _iceCap2.default(this._readTemplate('manual.html'));
    ice.load('content', html);

    // convert relative src to base url relative src.
    const $root = _cheerio2.default.load(ice.html).root();
    $root.find('img').each((i, el) => {
      const $el = (0, _cheerio2.default)(el);
      const src = $el.attr('src');
      if (!src) return;
      if (src.match(/^http[s]?:/)) return;
      if (src.charAt(0) === '/') return;
      $el.attr('src', `./manual/${src}`);
    });
    $root.find('a').each((i, el) => {
      const $el = (0, _cheerio2.default)(el);
      const href = $el.attr('href');
      if (!href) return;
      if (href.match(/^http[s]?:/)) return;
      if (href.charAt(0) === '/') return;
      if (href.charAt(0) === '#') return;
      $el.attr('href', `./manual/${href}`);
    });

    return $root.html();
  }

  /**
   * built manual card style index.
   * @param {Object[]} manuals - target manual.
   * @return {IceCap} built index.
   * @private
   */
  _buildManualCardIndex(manuals, manualIndex, badgeFlag) {
    const cards = [];
    for (const manual of manuals) {
      const fileName = this._getManualOutputFileName(manual.name, manual.destPrefix);
      const html = this._buildManual(manual);
      const $root = _cheerio2.default.load(html).root();
      const h1Count = $root.find('h1').length;

      $root.find('h1').each((i, el) => {
        const $el = (0, _cheerio2.default)(el);
        const label = $el.text();
        const link = h1Count === 1 ? fileName : `${fileName}#${$el.attr('id')}`;
        let card = `<h1>${label}</h1>`;
        const nextAll = $el.nextAll();

        for (let i = 0; i < nextAll.length; i++) {
          const next = nextAll.get(i);
          const tagName = next.tagName.toLowerCase();
          if (tagName === 'h1') return;
          const $next = (0, _cheerio2.default)(next);
          card += `<${tagName}>${$next.html()}</${tagName}>`;
        }

        cards.push({ label, link, card });
      });
    }

    const ice = new _iceCap2.default(this._readTemplate('manualCardIndex.html'));
    ice.loop('cards', cards, (i, card, ice) => {
      ice.attr('link', 'href', card.link);
      ice.load('card', card.card);
    });

    if (manualIndex && manualIndex.content) {
      const userIndex = (0, _util.markdown)(manualIndex.content);
      ice.load('manualUserIndex', userIndex);
    } else {
      ice.drop('manualUserIndex', true);
    }

    // fixme?
    ice.drop('manualBadge', !manualIndex.coverage || !badgeFlag);

    return ice;
  }

  /**
   * get manual file name.
   * @param {string} filePath - target manual markdown file path.
   * @returns {string} file name.
   * @private
   */
  _getManualOutputFileName(filePath, destPrefix) {
    const fileName = _path2.default.parse(filePath).name;
    const prefixedPath = destPrefix ? _path2.default.join(destPrefix, fileName) : fileName;
    return `manual/${prefixedPath}.html`;
  }
}
exports.default = ManualDocBuilder;