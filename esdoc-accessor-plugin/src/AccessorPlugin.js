class AccessorPlugin {
  constructor(tags, option = {}) {
    this._tags = tags;
    this._option = option;

    if (!('access' in this._option)) this._option.access = ['public', 'protected', 'private'];
    if (!('autoPrivate' in this._option)) this._option.autoPrivate = true;
  }

  exec(){
    const access = this._option.access;
    const autoPrivate = this._option.autoPrivate;
    for (const tag of this._tags) {
      if (!tag.access) {
        if (autoPrivate && tag.name.charAt(0) === '_') {
          tag.access = 'private';
        } else {
          tag.access = 'public';
        }
      }

      if (!access.includes(tag.access)) tag.ignore = true;
    }
  }
}

module.exports = AccessorPlugin;
