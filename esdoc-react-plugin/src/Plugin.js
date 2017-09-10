const path = require('path');
const cheerio = require('cheerio');
const ParamParser = require('esdoc/out/src/Parser/ParamParser').default;
const DocBuilder = require('esdoc-publish-html-plugin/out/src/Builder/DocBuilder').default;

class Plugin {
  constructor() {
    this._docs = null;
    this._reactPropsDocs = null;
  }

  onHandleDocs(ev) {
    this._docs = ev.data.docs;

    const reactPropsDocs = [];
    for (const doc of ev.data.docs) {
      if (doc.kind !== 'class') continue;
      if (!doc.unknown) continue;

      const reactProps = doc.unknown.filter(v => v.tagName === '@reactProps');
      if (!reactProps.length) continue;

      reactPropsDocs.push({
        longname: doc.longname,
        fileName: `${doc.longname}.html`,
        reactProps: reactProps
      });
    }

    this._reactPropsDocs = reactPropsDocs;
  }

  onHandleContent(ev) {
    const content = ev.data.content;
    const fileName = ev.data.fileName;

    // only html
    if (path.extname(fileName) !== '.html') return;

    // find target doc
    const doc = this._reactPropsDocs.find(doc => {
      const regexp = new RegExp(`${doc.fileName}$`);
      if (fileName.match(regexp)) return true;
    });
    if (!doc) return;

    // create esdoc properties from react props
    const properties = doc.reactProps.map(reactProp => {
      const {typeText, paramName, paramDesc} = ParamParser.parseParamValue(reactProp.tagValue);
      return ParamParser.parseParam(typeText, paramName, paramDesc);
    });

    // hack: create html
    const docBuilder = DocBuilder.createDefaultBuilder();
    const html = docBuilder._buildProperties(properties, 'React Props:').html;

    // append html
    const $ = cheerio.load(content);
    $('.self-detail.detail').append(html);

    ev.data.content = $.html();
  }
}

module.exports = new Plugin();
