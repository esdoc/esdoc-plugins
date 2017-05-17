import IceCap from 'ice-cap';
import path from 'path';
import {Buffer} from 'buffer';
import cheerio from 'cheerio';
import DocBuilder from './DocBuilder.js';
import {markdown, escapeURLHash} from './util.js';

/**
 * Manual Output Builder class.
 */
export default class ManualDocBuilder extends DocBuilder {
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
      ice.load('content', this._buildManualCardIndex(manuals, manualIndex, badge), IceCap.MODE_WRITE);
      ice.load('nav', this._buildManualNav(manuals), IceCap.MODE_WRITE);
      ice.text('title', 'Manual', IceCap.MODE_WRITE);
      ice.attr('baseUrl', 'href', baseUrl, IceCap.MODE_WRITE);
      ice.attr('rootContainer', 'class', ' manual-index');
      writeFile(fileName, ice.html);

      if (manualIndex.globalIndex) {
        ice.attr('baseUrl', 'href', './', IceCap.MODE_WRITE);
        writeFile('index.html', ice.html);
      }

      ice.attr('rootContainer', 'class', ' manual-index', IceCap.MODE_REMOVE);
    }

    for (const manual of manuals) {
      const fileName = this._getManualOutputFileName(manual.name);
      const baseUrl = this._getBaseUrl(fileName);
      ice.load('content', this._buildManual(manual), IceCap.MODE_WRITE);
      ice.load('nav', this._buildManualNav(manuals), IceCap.MODE_WRITE);
      ice.attr('baseUrl', 'href', baseUrl, IceCap.MODE_WRITE);
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
    const specialFileNamePatterns = [
      '(overview.*)',
      '(design.*)',
      '(installation.*)|(install.*)',
      '(usage.*)',
      '(configuration.*)|(config.*)',
      '(example.*)',
      '(faq.*)',
      '(changelog.*)'
    ];

    let count = 0;
    for (const pattern of specialFileNamePatterns) {
      const regexp = new RegExp(pattern, 'i');
      for (const manual of manuals) {
        const fileName = path.parse(manual.name).name;
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
    const ice = new IceCap(this._readTemplate('manualIndex.html'));

    ice.loop('manual', manuals, (i, manual, ice)=>{
      const toc = [];
      const fileName = this._getManualOutputFileName(manual.name);
      const html = markdown(manual.content);
      const $root = cheerio.load(html).root();
      const h1Count = $root.find('h1').length;

      $root.find('h1,h2,h3,h4,h5').each((i, el)=>{
        const $el = cheerio(el);
        const label = $el.text();
        const indent = `indent-${el.tagName.toLowerCase()}`;

        let link = `${fileName}#${$el.attr('id')}`;
        if (el.tagName.toLowerCase() === 'h1' && h1Count === 1) link = fileName;

        toc.push({label, link, indent});
      });

      ice.loop('manualNav', toc, (i, tocItem, ice)=>{
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
    const html = markdown(manual.content);
    const ice = new IceCap(this._readTemplate('manual.html'));
    ice.load('content', html);

    // convert relative src to base url relative src.
    const $root = cheerio.load(ice.html).root();
    $root.find('img').each((i, el)=>{
      const $el = cheerio(el);
      const src = $el.attr('src');
      if (!src) return;
      if (src.match(/^http[s]?:/)) return;
      if (src.charAt(0) === '/') return;
      $el.attr('src', `./manual/${src}`);
    });
    $root.find('a').each((i, el)=>{
      const $el = cheerio(el);
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
      const fileName = this._getManualOutputFileName(manual.name);
      const html = this._buildManual(manual);
      const $root = cheerio.load(html).root();
      const h1Count = $root.find('h1').length;

      $root.find('h1').each((i, el)=>{
        const $el = cheerio(el);
        const label = $el.text();
        const link = h1Count === 1 ? fileName : `${fileName}#${$el.attr('id')}`;
        let card = `<h1>${label}</h1>`;
        const nextAll = $el.nextAll();

        for (let i = 0; i < nextAll.length; i++) {
          const next = nextAll.get(i);
          const tagName = next.tagName.toLowerCase();
          if (tagName === 'h1') return;
          const $next = cheerio(next);
          card += `<${tagName}>${$next.html()}</${tagName}>`;
        }

        cards.push({label, link, card});
      });
    }

    const ice = new IceCap(this._readTemplate('manualCardIndex.html'));
    ice.loop('cards', cards, (i, card, ice)=>{
      ice.attr('link', 'href', card.link);
      ice.load('card', card.card);
    });

    if (manualIndex && manualIndex.content) {
      const userIndex = markdown(manualIndex.content);
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
  _getManualOutputFileName(filePath) {
    const fileName = path.parse(filePath).name;
    return `manual/${fileName}.html`;
  }
}
