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

      //Filter each doc by its path
      docs.forEach((doc) => {
        const fileName = this._getOutputFileName(doc);

        if (!docPaths[fileName]) docPaths[fileName] = [doc];
        else docPaths[fileName].push(doc);
      });

      //Build each output file
      for (const docPath in docPaths) {
        const docs = docPaths[docPath];

        //Build the title from path
        let paths = docPath.split('/').filter(function(path){
          return !path.match(/(^\.$)|(index\.html$)/gi);
        });
        let title = paths.join(' / ').replace(/\b(\w)/g, c => c.toUpperCase());
        title = this._getTitle(title);

        ice.load('content', this._buildSingleDoc(docs, kind, title), IceCap.MODE_WRITE);
        ice.attr('baseUrl', 'href', this._getBaseUrl(docPath), IceCap.MODE_WRITE);
        ice.text('title', title, IceCap.MODE_WRITE);
        writeFile(docPath, ice.html);
      }
    }
  }

  /**
   * build single output.
   * @param {DocObject[]} docs - target docs.
   * @param {string} kind - target kind property.
   * @param {string} title - output title
   * @returns {string} html of single output
   * @private
   */
  _buildSingleDoc(docs, kind, title) {
    const ice = new IceCap(this._readTemplate('single.html'));
    ice.text('title', title);

    docs.forEach((doc) => {
      ice.load('summaries', this._buildSummaryHTML(doc, kind, 'Summary', true, this._getPath(doc)), 'append');
      ice.load('details', this._buildDetailHTML(doc, kind, '', true, this._getPath(doc)), 'append');
    });

    return ice.html;
  }
}
