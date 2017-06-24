class Plugin {
  onHandleDocs(ev) {
    for (const doc of ev.data.docs) {
      if (doc.kind === 'file' || doc.kind === 'testFile') doc.content = '';
    }
  }
}

module.exports = new Plugin();
