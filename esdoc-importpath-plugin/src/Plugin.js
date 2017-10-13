const fs = require('fs');

class Plugin {
  onHandleConfig(ev) {
    this._config = ev.data.config;
  }

  onHandleDocs(ev) {
    const packagePath = this._config.package || './package.json';
    const option = ev.data.option;

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

    for (const doc of ev.data.docs) {
      if (!doc.importPath) continue;

      let importPath = doc.importPath;
      if (packageName) importPath = importPath.replace(new RegExp(`^${packageName}/`), '');

      for (let item of option.replaces) {
        importPath = importPath.replace(item.from, item.to);
      }

      if (importPath === mainPath || importPath.trim().length === 0) {
        doc.importPath = packageName;
      } else if (packageName && option.stripPackageName !== true) {
        doc.importPath = `${packageName}/${importPath}`;
      } else {
        doc.importPath = importPath;
      }
    }
  }
}

module.exports = new Plugin();
