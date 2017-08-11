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

        if (!docPaths[docPath]) docPaths[docPath] = outPath;
      });

      //Build each output file
      for (const docPath in docPaths) {
        const outPath = docPaths[docPath];

        // Build the title from the path
        const pathTitle = [...docPath.split('/'), kind]
          .map((p) => p.replace(/\b(\w)/g, p => p.toUpperCase()))
          .join(' / ');
        let title = this._getTitle(pathTitle);

        ice.load('content', this._buildSingleDoc(docPath, kind, title), IceCap.MODE_WRITE);
        ice.attr('baseUrl', 'href', this._getBaseUrl(outPath), IceCap.MODE_WRITE);
        ice.text('title', title, IceCap.MODE_WRITE);
        writeFile(outPath, ice.html);
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
