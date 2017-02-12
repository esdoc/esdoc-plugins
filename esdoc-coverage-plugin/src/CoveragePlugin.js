const path = require('path');
const fs = require('fs-extra');

/**
 * Coverage Plugin.
 */
class CoveragePlugin {
  constructor(config, tags, option = {enable: true}) {
    this._config = config;
    this._tags = tags;
    this._option = option;
  }

  /**
   * execute building output.
   */
  exec() {
    if (!this._option.enable) return;

    const docs = this._tags.filter(v => ['class', 'method', 'member', 'get', 'set', 'constructor', 'function', 'variable'].includes(v.kind));
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

    const coverageOutPath = path.resolve(this._config.destination, 'coverage.json');
    fs.outputFileSync(coverageOutPath, JSON.stringify(coverage, null, 2));

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

    const badgeOutPath = path.resolve(this._config.destination, 'badge.svg');
    fs.outputFileSync(badgeOutPath, badge);
  }
}

module.exports = CoveragePlugin;
