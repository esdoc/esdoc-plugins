import IceCap from 'ice-cap';
import path from 'path';
import cheerio from 'cheerio';
import DocBuilder from './DocBuilder.js';
import {markdown} from './util.js';

/**
 * Manual Output Builder class.
 */
export default class ManualDocBuilder extends DocBuilder {
  exec(writeFile, copyDir, readFile) {

    const manualKinds = [
      'manualOverview',
      'manualDesign',
      'manualInstallation',
      'manualTutorial',
      'manualUsage',
      'manualConfiguration',
      'manualAdvanced',
      'manualExample',
      'manualReference',
      'manualFaq',
      'manualChangelog'
    ];

    const manuals = this._tags.filter(tag => manualKinds.includes(tag.kind));
    if (manuals.length === 0) return;

    const manualIndex = this._tags.find(tag => tag.kind === 'manualIndex');
    const manualAsset = this._tags.find(tag => tag.kind === 'manualAsset');

    manuals.push({kind: 'manualReference'});

    const ice = this._buildLayoutDoc();
    ice.autoDrop = false;
    ice.attr('rootContainer', 'class', ' manual-root');

    {
      const fileName = 'manual/index.html';
      const baseUrl = this._getBaseUrl(fileName);
      ice.load('content', this._buildManualCardIndex(manuals, manualKinds, manualIndex, readFile('identifiers.html')), IceCap.MODE_WRITE);
      ice.load('nav', this._buildManualNav(manuals, manualKinds), IceCap.MODE_WRITE);
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

    for (const manualKind of manualKinds) {
      if (manualKind === 'manualReference') continue;

      const title = manualKind.replace(/^manual/, '');
      const _manuals = manuals.filter(manual => manual.kind === manualKind);
      for (const manual of _manuals) {
        const fileName = this._getManualOutputFileName(manualKind, manual.name);
        const baseUrl = this._getBaseUrl(fileName);
        ice.load('content', this._buildManual(manual), IceCap.MODE_WRITE);
        ice.load('nav', this._buildManualNav(manuals, manualKinds), IceCap.MODE_WRITE);
        ice.text('title', title, IceCap.MODE_WRITE);
        ice.attr('baseUrl', 'href', baseUrl, IceCap.MODE_WRITE);
        writeFile(fileName, ice.html);
      }
    }

    if (manualAsset) {
      copyDir(manualAsset.name, 'manual/asset');
    }

    // badge
    {
      const tmp = {};
      manuals.forEach(manual => tmp[manual.kind] = true);
      const kinds = Object.keys(tmp);
      // const starCount = Math.min(Math.floor((manualConfig.length - 1) / 2), 5);
      // const star = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);
      const ratio = Math.floor(100 * (kinds.length - 1) / 10);

      let color;
      if (ratio < 50) {
        color = '#db654f';
      } else if (ratio < 90) {
        color = '#dab226';
      } else {
        color = '#4fc921';
      }

      let badge = this._readTemplate('image/manual-badge.svg');
      badge = badge.replace(/@value@/g, `${ratio}%`);
      badge = badge.replace(/@color@/g, color);
      writeFile('manual-badge.svg', badge);
    }
  }

  /**
   * build manual navigation.
   * @param {ManualConfigItem[]} manualConfig - target manual config.
   * @return {IceCap} built navigation
   * @private
   */
  _buildManualNav(manuals, manualKinds) {
    const ice = new IceCap(this._readTemplate('manualIndex.html'));

    ice.loop('manual', manualKinds, (i, manualKind, ice)=>{
      const toc = [];
      if (manualKind === 'manualReference') {
        const identifiers = this._findAllIdentifiersKindGrouping();
        toc.push({label: 'Reference', link: 'identifiers.html', indent: 'indent-h1'});
        if (identifiers.class.length) toc.push({label: 'Class', link: 'identifiers.html#class', indent: 'indent-h2'});
        if (identifiers.interface.length) toc.push({label: 'Interface', link: 'identifiers.html#interface', indent: 'indent-h2'});
        if (identifiers.function.length) toc.push({label: 'Function', link: 'identifiers.html#function', indent: 'indent-h2'});
        if (identifiers.variable.length) toc.push({label: 'Variable', link: 'identifiers.html#variable', indent: 'indent-h2'});
        if (identifiers.typedef.length) toc.push({label: 'Typedef', link: 'identifiers.html#typedef', indent: 'indent-h2'});
        if (identifiers.external.length) toc.push({label: 'External', link: 'identifiers.html#external', indent: 'indent-h2'});

        toc[0].sectionCount = identifiers.class.length +
          identifiers.interface.length +
          identifiers.function.length +
          identifiers.typedef.length +
          identifiers.external.length;
      } else {
        const _manuals = manuals.filter(manual => manual.kind === manualKind);
        for (const manual of _manuals) {
          const fileName = this._getManualOutputFileName(manual.kind, manual.name);
          const html = this._convertMDToHTML(manual.content);
          const $root = cheerio.load(html).root();
          const h1Count = $root.find('h1').length;
          const sectionCount = $root.find('h1,h2,h3,h4,h5').length;

          $root.find('h1,h2,h3,h4,h5').each((i, el)=>{
            const $el = cheerio(el);
            const label = $el.text();
            const indent = `indent-${el.tagName.toLowerCase()}`;

            let link = `${fileName}#${$el.attr('id')}`;
            if (el.tagName.toLowerCase() === 'h1' && h1Count === 1) link = fileName;

            toc.push({label, link, indent, sectionCount});
          });
        }
      }

      const name = manualKind.replace(/^manual/, '').toLowerCase();
      ice.attr('manual', 'data-toc-name', name);
      ice.loop('manualNav', toc, (i, tocItem, ice)=>{
        if (tocItem.indent === 'indent-h1') {
          ice.attr('manualNav', 'class', `${tocItem.indent} manual-color manual-color-${name}`);
          const sectionCount = Math.min((tocItem.sectionCount / 5) + 1, 5);
          ice.attr('manualNav', 'data-section-count', '■'.repeat(sectionCount));
        } else {
          ice.attr('manualNav', 'class', tocItem.indent);
        }

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
    const title = manual.kind.replace(/^manual/, '');
    const html = this._convertMDToHTML(manual.content);
    const ice = new IceCap(this._readTemplate('manual.html'));
    ice.text('title', title);
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
  _buildManualCardIndex(manuals, manualKinds, manualIndex, identifierHTML) {
    const cards = [];
    for (const manualKind of manualKinds) {
      if (manualKind === 'manualReference') {
        // const filePath = path.resolve(this._config.destination, 'identifiers.html');
        // const html = fs.readFileSync(filePath).toString();
        const $ = cheerio.load(identifierHTML);
        const card = $('.content').html();
        const identifiers = this._findAllIdentifiersKindGrouping();
        const sectionCount = identifiers.class.length +
          identifiers.interface.length +
          identifiers.function.length +
          identifiers.typedef.length +
          identifiers.external.length;

        cards.push({label: 'References', link: 'identifiers.html', card: card, type: 'reference', sectionCount: sectionCount});
        continue;
      }

      const _manuals = manuals.filter(manual => manual.kind === manualKind);
      for (const manual of _manuals) {
        const type = manual.kind.replace(/^manual/, '').toLowerCase();
        const fileName = this._getManualOutputFileName(manual.kind, manual.name);
        const html = this._buildManual(manual);
        const $root = cheerio.load(html).root();
        const h1Count = $root.find('h1').length;
        const sectionCount = $root.find('h1,h2,h3,h4,h5').length;

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

          cards.push({label, link, card, type, sectionCount});
        });
      }
    }

    const ice = new IceCap(this._readTemplate('manualCardIndex.html'));
    ice.loop('cards', cards, (i, card, ice)=>{
      ice.text('label-inner', card.label);
      ice.attr('label', 'class', `manual-color manual-color-${card.type}`);

      const sectionCount = Math.min((card.sectionCount / 5) + 1, 5);
      ice.attr('label', 'data-section-count', '■'.repeat(sectionCount));

      ice.attr('link', 'href', card.link);
      ice.load('card', card.card);
    });

    if (manualIndex) {
      const userIndex = this._convertMDToHTML(manualIndex.content);
      ice.load('manualUserIndex', userIndex);
    } else {
      ice.drop('manualUserIndex', true);
    }

    // fixme?
    ice.drop('manualBadge', !manualIndex.coverage);

    return ice;
  }

  /**
   * get manual file name.
   * @param {string} kind - target manual kind.
   * @param {string} filePath - target manual markdown file path.
   * @returns {string} file name.
   * @private
   */
  _getManualOutputFileName(kind, filePath) {
    const fileName = path.parse(filePath).name;
    return `manual/${kind.replace(/^manual/,'').toLowerCase()}/${fileName}.html`;
  }

  /**
   * convert markdown to html.
   * if markdown has only one ``h1`` and it's text is ``item.label``, remove the ``h1``.
   * because duplication ``h1`` in output html.
   * @param {string} content - target.
   * @returns {string} converted html.
   * @private
   */
  _convertMDToHTML(content) {
    const html = markdown(content);
    const $root = cheerio.load(html).root();
    return $root.html();
  }
}
