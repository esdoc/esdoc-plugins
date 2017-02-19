class UnexportedIdentifierPlugin {
  constructor(option = {}) {
    this._option = option;

    if (!('enable' in this._option)) this._option.enable = true;
  }

  exec(tags){
    if (!this._option.enable) return;

    for (const tag of tags) {
      if (tag.export === false && tag.ignore === true) tag.ignore = false;
    }

    return tags;
  }
}

module.exports = UnexportedIdentifierPlugin;
