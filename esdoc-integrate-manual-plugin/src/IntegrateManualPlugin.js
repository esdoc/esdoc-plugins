const fs = require('fs');
const path = require('path');

class IntegrateManualPlugin {
  constructor(docs, option) {
    this._docs = docs;
    this._option = option;
  }

  exec(){
    this._setDefault();

    const docs = this._generateDocs();
    this._docs.push(...docs);
  }

  _setDefault() {
    if (!this._option) return;

    if (!('coverage' in this._option)) this._option.coverage = true;
  }

  _generateDocs() {
    const manual = this._option;
    const results = [];

    if (!this._option) return results;

    if (manual.index) {
      results.push({
        kind: 'manualIndex',
        globalIndex: manual.globalIndex,
        coverage: manual.coverage,
        content: fs.readFileSync(manual.index).toString(),
        longname: path.resolve(manual.index),
        name: manual.index,
        static: true,
        access: 'public'
      });
    } else {
      results.push({
        kind: 'manualIndex',
        globalIndex: false,
        coverage: manual.coverage,
        content: null,
        longname: '', // longname does not must be null.
        name: manual.index,
        static: true,
        access: 'public'
      });
    }

    if (manual.asset) {
      results.push({
        kind: 'manualAsset',
        longname: path.resolve(manual.asset),
        name: manual.asset,
        static: true,
        access: 'public'
      });
    }

    for (const filePath of manual.files) {
      results.push({
        kind: 'manual',
        longname: path.resolve(filePath),
        name: filePath,
        content: fs.readFileSync(filePath).toString(),
        static: true,
        access: 'public'
      });
    }

    return results;
  }
}

module.exports = IntegrateManualPlugin;
