class ExcludeSourcePlugin {
  exec(tags) {
    for (const tag of tags) {
      if (tag.kind === 'file' || tag.kind === 'testFile') tag.content = '';
    }

    return tags;
  }
}

module.exports = ExcludeSourcePlugin;
