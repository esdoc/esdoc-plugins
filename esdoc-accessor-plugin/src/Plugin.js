class Plugin {
  constructor() {
    this._docs = null;
    this._option = null;
  }

  onHandleDocs(ev) {
    const option = ev.data.option || {};
    if (!('access' in option)) option.access = ['public', 'protected', 'private'];
    if (!('autoPrivate' in option)) option.autoPrivate = true;

    const access = option.access;
    const autoPrivate = option.autoPrivate;
    for (const doc of ev.data.docs) {
      if (!doc.access) {
        if (autoPrivate && doc.name.charAt(0) === '_') {
          doc.access = 'private';
        } else {
          doc.access = 'public';
        }
      }

      if (!access.includes(doc.access)) doc.ignore = true;
    }
  }
}

module.exports = new Plugin();
