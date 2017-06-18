class Plugin {
  onHandleDocs(ev) {
    this._docs = ev.data.docs;
  }
}

module.exports = new Plugin();
