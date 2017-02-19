const fs = require('fs');

class ImportPathPlugin {
  constructor(config, tags, option) {
    this._config = config;
    this._tags = tags;
    this._option = option;
  }

  exec() {
    const packagePath = this._config.package || './package.json';

    const option = this._option;
    for (let item of option.replaces) {
      item.from = new RegExp(item.from);
    }

    // get package.json
    let packageName = '';
    let mainPath = '';
    try {
      const packageJSON = fs.readFileSync(packagePath).toString();
      const packageObj = JSON.parse(packageJSON);
      packageName = packageObj.name;
      if(packageObj.main) mainPath = packageObj.main;
    } catch (e) {
      // ignore
    }

    for (const tag of this._tags) {
      if (!tag.importPath) continue;

      let importPath = tag.importPath;
      if (packageName) importPath = importPath.replace(new RegExp(`^${packageName}/`), '');

      for (let item of option.replaces) {
        importPath = importPath.replace(item.from, item.to);
      }

      if (importPath === mainPath) {
        tag.importPath = packageName;
      } else if (packageName) {
        tag.importPath = `${packageName}/${importPath}`;
      } else {
        tag.importPath = importPath;
      }
    }
  }
}

module.exports = ImportPathPlugin;
