class Plugin {
  onHandleDocs(ev) {
    const option = ev.data.option || {};
    if (!('enable' in option)) option.enable = false;

    const ignore = !option.enable;

    for (const doc of ev.data.docs) {
      if (doc.export === false && ignore && !('ignore' in doc))  {
        doc.ignore = ignore;
      }
    }
  }
}

module.exports = new Plugin();
