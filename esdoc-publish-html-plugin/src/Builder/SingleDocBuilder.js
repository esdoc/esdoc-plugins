import IceCap from 'ice-cap';
import DocBuilder from './DocBuilder.js';

/**
 * Single output builder class.
 * "single" means function, variable, typedef, external, etc...
 */
export default class SingleDocBuilder extends DocBuilder {
  exec(writeFile, copyDir) {
    const ice = this._buildLayoutDoc();
    ice.autoClose = false;

    const kinds = ['function', 'variable', 'typedef'];
    for (const kind of kinds) {
      const docs = this._find({kind: kind});
      if (!docs.length) continue;

      //Organize by paths
      let docPaths = {};

      //Get the doc path and file output path
      docs.forEach((doc) => {
        const docPath = this._getPath(doc);
        const outPath = this._getOutputFileName(doc);
        const docTitle = this._getTitle(doc);

        if (!docPaths[docPath]) docPaths[docPath] = {
          outPath,
          docTitle
        };
      });

      //Build each output file
      for (const docPath in docPaths) {
        const docObj = docPaths[docPath];

        ice.load('content', this._buildSingleDoc(docPath, kind, docObj.docTitle), IceCap.MODE_WRITE);
        ice.attr('baseUrl', 'href', this._getBaseUrl(docObj.outPath), IceCap.MODE_WRITE);
        ice.text('title', docObj.docTitle, IceCap.MODE_WRITE);
        writeFile(docObj.outPath, ice.html);
      }
    }
  }

  /**
   * build single output.
   * @param {string} docPath - doc path.
   * @param {string} kind - target kind property.
   * @param {string} title - output title
   * @returns {string} html of single output
   * @private
   */
  _buildSingleDoc(docPath, kind, title) {
    const ice = new IceCap(this._readTemplate('single.html'));
    ice.text('title', title);
    ice.load('summaries', this._buildSummaryHTML(null, kind, 'Summary', true, docPath), 'append');
    ice.load('details', this._buildDetailHTML(null, kind, '', true, docPath));
    return ice.html;
  }
}
