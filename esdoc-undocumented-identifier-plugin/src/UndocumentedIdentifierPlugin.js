class UndocumentedIdentifierPlugin {
  constructor(option = {}) {
    this._option = option;

    if (!('enable' in this._option)) this._option.enable = true;
  }

  exec(tags){
    const ignore = !this._option.enable;

    for (const tag of tags) {
      if (tag.undocument === true && !('ignore' in tag))  {
        tag.ignore = ignore;
      }
    }

    return tags;
  }
}

module.exports = UndocumentedIdentifierPlugin;
