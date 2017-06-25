const assert = require('assert');
const path = require('path');
const fs = require('fs');
const TestDocFactory = require('./TestDocFactory');

// hack
const ESParser = require('esdoc/out/src/Parser/ESParser').default;
const InvalidCodeLogger = require('esdoc/out/src/Util/InvalidCodeLogger').default;
const PathResolver = require('esdoc/out/src/Util/PathResolver').default;
const ASTUtil = require('esdoc/out/src/Util/ASTUtil').default;

class Plugin {
  onHandleDocs(ev) {
    this._docs = ev.data.docs;
    this._option = ev.data.option;

    this._exec();
  }

  _exec() {
    this._setDefault();

    const docs = this._generateDocs();
    this._docs.push(...docs);
  }

  _setDefault() {
    if (!this._option) return;

    const option = this._option;
    assert(option.source);
    if (!option.interfaces) option.interfaces = ['describe', 'it', 'context', 'suite', 'test'];
    if (!option.includes) option.includes = ['(spec|Spec|test|Test)\\.js$'];
    if (!option.excludes) option.excludes = ['\\.config\\.js$'];
  }

  /**
   * Generate document from test code.
   */
  _generateDocs() {
    const option = this._option;
    const results = [];

    if (!option) return results;

    const includes = option.includes.map((v) => new RegExp(v));
    const excludes = option.excludes.map((v) => new RegExp(v));
    const sourceDirPath = path.resolve(option.source);

    this._walk(option.source, (filePath)=>{
      const relativeFilePath = path.relative(sourceDirPath, filePath);
      let match = false;
      for (const reg of includes) {
        if (relativeFilePath.match(reg)) {
          match = true;
          break;
        }
      }
      if (!match) return;

      for (const reg of excludes) {
        if (relativeFilePath.match(reg)) return;
      }

      console.log(`parse: ${filePath}`);
      const temp = this._traverse(option.interfaces, option.source, filePath);
      if (!temp) return;
      results.push(...temp.results);

      // todo: enable work
      // asts.push({filePath: `test${path.sep}${relativeFilePath}`, ast: temp.ast});
    });

    return results;
  }

  /**
   * walk recursive in directory.
   * @param {string} dirPath - target directory path.
   * @param {function(entryPath: string)} callback - callback for find file.
   * @private
   */
  _walk(dirPath, callback) {
    const entries = fs.readdirSync(dirPath);

    for (const entry of entries) {
      const entryPath = path.resolve(dirPath, entry);
      const stat = fs.statSync(entryPath);

      if (stat.isFile()) {
        callback(entryPath);
      } else if (stat.isDirectory()) {
        this._walk(entryPath, callback);
      }
    }
  }

  /**
   * traverse doc comment in test code file.
   * @param {string[]} interfaces - test interface names.
   * @param {string} inDirPath - root directory path.
   * @param {string} filePath - target test code file path.
   * @returns {Object} return document info that is traversed.
   * @property {DocObject[]} results - this is contained test code.
   * @property {AST} ast - this is AST of test code.
   * @private
   */
  _traverse(interfaces, inDirPath, filePath) {
    let ast;
    try {
      ast = ESParser.parse(filePath);
    } catch (e) {
      InvalidCodeLogger.showFile(filePath, e);
      return null;
    }
    const pathResolver = new PathResolver(inDirPath, filePath);
    const factory = new TestDocFactory(interfaces, ast, pathResolver);

    ASTUtil.traverse(ast, (node, parent)=>{
      try {
        factory.push(node, parent);
      } catch (e) {
        InvalidCodeLogger.show(filePath, node);
        throw e;
      }
    });

    return {results: factory.results, ast: ast};
  }
}

module.exports = new Plugin();
