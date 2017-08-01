const fs = require('fs');
const path = require('path');

class Plugin {
  onHandleDocs(ev) {
    this._docs = ev.data.docs;
  }

  onPublish(ev) {
    const option = ev.data.option || {};
    if (!('enable' in option)) option.enable = true;
    if (!option.enable) return;
    if (!('kind' in option)) option.kind = ['class', 'method', 'member', 'get', 'set', 'constructor', 'function', 'variable'];
    if (!option.kind) return;
    const docs = this._docs.filter(v => option.kind.includes(v.kind));
    const expectCount = docs.length;
    let actualCount = 0;
    const files = {};

    for (const doc of docs) {
      const filePath = doc.longname.split('~')[0];
      if (!files[filePath]) files[filePath] = {expectCount: 0, actualCount: 0, undocumentLines: []};
      files[filePath].expectCount++;

      if (doc.undocument) {
        files[filePath].undocumentLines.push(doc.lineNumber);
      } else {
        actualCount++;
        files[filePath].actualCount++;
      }
    }

    const coveragePercent = (expectCount === 0 ? 0 : Math.floor(10000 * actualCount / expectCount) / 100);

    const coverage = {
      coverage: `${coveragePercent}%`,
      expectCount: expectCount,
      actualCount: actualCount,
      files: files
    };

    ev.data.writeFile('coverage.json', JSON.stringify(coverage, null, 2));

    // create badge
    const ratio = Math.floor(100 * actualCount / expectCount);
    let color;
    if (ratio < 50) {
      color = '#db654f';
    } else if (ratio < 90) {
      color = '#dab226';
    } else {
      color = '#4fc921';
    }

    const filePath = path.resolve(__dirname, 'badge.svg');
    let badge = fs.readFileSync(filePath, {encoding: 'utf-8'});
    badge = badge.replace(/@ratio@/g, `${ratio}%`);
    badge = badge.replace(/@color@/g, color);

    ev.data.writeFile('badge.svg', badge);
  }
}

module.exports = new Plugin();
