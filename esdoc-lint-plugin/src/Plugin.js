const path = require('path');
const fs = require('fs');
// hack: using a internal code of esdoc.
const ASTNodeContainer = require('esdoc/out/src/Util/ASTNodeContainer.js').default;

/**
 * Lint Output Builder class.
 */
class Plugin {
  onHandleDocs(ev) {
    this._docs = ev.data.docs;
    this._option = ev.data.option || {};
    this._results = null;
    if (!('enable' in this._option)) this._option.enable = true;
  }

  onPublish(ev) {
    if (!this._option.enable) return;

    const tmpResults = [];
    const docs = this._docs.filter(v => ['method', 'function'].includes(v.kind));
    for (const doc of docs) {
      if (doc.undocument) continue;

      const node = ASTNodeContainer.getNode(doc.__docId__);
      const codeParams = this._getParamsFromNode(node);
      const docParams = this._getParamsFromDoc(doc);
      if (this._match(codeParams, docParams)) continue;

      tmpResults.push({node, doc, codeParams, docParams});
    }

    const results = this._formatResult(tmpResults);

    ev.data.writeFile('lint.json', JSON.stringify(results, null, 2));

    this._results = results;
  }

  onComplete() {
    if (!this._option.enable) return;

    this._showResult();
  }

  /**
   * get variable names of method argument.
   * @param {ASTNode} node - target node.
   * @returns {string[]} variable names.
   * @private
   */
  _getParamsFromNode(node) {
    let params;
    switch (node.type) {
      case 'FunctionExpression':
      case 'FunctionDeclaration':
        params = node.params || [];
        break;
      case 'ClassMethod':
        params = node.params || [];
        break;
      case 'ArrowFunctionExpression':
        params = node.params || [];
        break;
      default:
        throw new Error(`unknown node type. type = ${node.type}`);
    }

    const result = [];
    for (const param of params) {
      switch (param.type) {
        case 'Identifier':
          result.push(param.name);
          break;
        case 'AssignmentPattern':
          if (param.left.type === 'Identifier') {
            result.push(param.left.name);
          } else if (param.left.type === 'ObjectPattern') {
            result.push('*');
          }
          break;
        case 'RestElement':
          result.push(param.argument.name);
          break;
        case 'ObjectPattern':
          result.push('*');
          break;
        case 'ArrayPattern':
          result.push('*');
          break;
        default:
          throw new Error(`unknown param type: ${param.type}`);
      }
    }

    return result;
  }

  /**
   * get variable names of method argument.
   * @param {DocObject} doc - target doc object.
   * @returns {string[]} variable names.
   * @private
   */
  _getParamsFromDoc(doc) {
    const params = doc.params || [];
    return params.map(v => v.name).filter(v => !v.includes('.')).filter(v => !v.includes('['));
  }

  _match(codeParams, docParams) {
    if (codeParams.length !== docParams.length) return false;

    for (let i = 0; i < codeParams.length; i++) {
      if (codeParams[i] === '*') {
        // nothing
      } else if (codeParams[i] !== docParams[i]) {
        return false;
      }
    }

    return true;
  }

  /**
   * show invalid lint code.
   * @param {Object[]} tmpResults - target results.
   * @param {DocObject} tmpResults[].doc
   * @param {ASTNode} tmpResults[].node
   * @param {string[]} tmpResults[].codeParams
   * @param {string[]} tmpResults[].docParams
   * @private
   */
  _formatResult(tmpResults) {
    const results = [];
    for (const result of tmpResults) {
      const doc = result.doc;
      const node = result.node;
      const filePath = doc.longname.split('~')[0];
      const name = doc.longname.split('~')[1];

      let startLineNumber;

      if (node.leadingComments) {
        const comment = node.leadingComments[node.leadingComments.length - 1];
        startLineNumber = comment.loc.start.line;
      } else if (node.parent.leadingComments) {
        const comment = node.parent.leadingComments[node.parent.leadingComments.length - 1];
        startLineNumber = comment.loc.start.line;
      } else {
        // Missing leadingComments fallback: will report the node start line instead of the comment one
        startLineNumber = node.loc.start.line;
      }

      const endLineNumber = node.loc.start.line;
      const fileDoc = this._docs.find(tag => tag.kind === 'file' && tag.name === filePath);
      const lines = fileDoc.content.split('\n');
      const targetLines = [];

      for (let i = startLineNumber - 1; i < endLineNumber; i++) {
        targetLines.push({lineNumber: i, line: lines[i]});
      }

      results.push({
        name: name,
        filePath: filePath,
        lines: targetLines,
        codeParams: result.codeParams,
        docParams: result.docParams,
      });
    }

    return results;
  }

  _showResult() {
    if (!this._option.enable) return;
    for (const result of this._results) {
      console.log(`[33mwarning: signature mismatch: ${result.name} ${result.filePath}#${result.lines[0].lineNumber}[32m`);
      for (const line of result.lines) {
        console.log(`${line.lineNumber}| ${line.line}`);
      }
      console.log('[0m');
    }
  }
}

module.exports = new Plugin();
