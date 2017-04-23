class UnexportedIdentifierPlugin {
  constructor(option = {}) {
    this._option = option;

    if (!('enable' in this._option)) this._option.enable = false;
  }

  exec(tags){
    const ignore = !this._option.enable;

    for (const tag of tags) {
      if (tag.export === false && ignore && !('ignore' in tag))  {
        tag.ignore = ignore;
      }
    }

    return tags;
  }
}

module.exports = UnexportedIdentifierPlugin;
