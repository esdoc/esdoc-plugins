class Plugin {
  onHandleDocs(ev) {
    this._option = ev.data.option || {};
    if (!('enable' in this._option)) this._option.enable = true;

    const ignore = !this._option.enable;

    for (const doc of ev.data.docs) {
      if (doc.undocument === true && ignore && !('ignore' in doc))  {
        doc.ignore = ignore;
      }
    }
  }
}

module.exports = new Plugin();
