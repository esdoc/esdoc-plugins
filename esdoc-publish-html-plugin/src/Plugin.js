import {taffy} from 'taffydb';
import IceCap from 'ice-cap';
import DocBuilder from './Builder/DocBuilder';
import StaticFileBuilder from './Builder/StaticFileBuilder.js';
import IdentifiersDocBuilder from './Builder/IdentifiersDocBuilder.js';
import IndexDocBuilder from './Builder/IndexDocBuilder.js';
import ClassDocBuilder from './Builder/ClassDocBuilder.js';
import SingleDocBuilder from './Builder/SingleDocBuilder.js';
import FileDocBuilder from './Builder/FileDocBuilder.js';
import SearchIndexBuilder from './Builder/SearchIndexBuilder.js';
import SourceDocBuilder from './Builder/SourceDocBuilder.js';
import TestDocBuilder from './Builder/TestDocBuilder.js';
import TestFileDocBuilder from './Builder/TestFileDocBuilder.js';
import ManualDocBuilder from './Builder/ManualDocBuilder.js';
import PluginOptions from './PluginOptions';

class Plugin {
  onHandleDocs(ev) {
    this._docs = ev.data.docs;
  }

  onPublish(ev) {
    this._options = ev.data.option || {};
    this._exec(this._docs, ev.data.writeFile, ev.data.copyDir, ev.data.readFile);
  }

  _exec(tags, writeFile, copyDir, readFile) {
    //Copy options
    for (var key in PluginOptions) {
      //Mismatch?
      if (typeof this._options[key] !== typeof PluginOptions[key]) {
        this._options[key] = PluginOptions[key];
      }
    }

    IceCap.debug = !!this._options.debug;

    const data = taffy(tags);

    //bad hack: for other plugin uses builder.
    DocBuilder.createDefaultBuilder = function() {
      return new DocBuilder(data, tags, this._options);
    };

    let coverage = null;
    try {
      coverage = JSON.parse(readFile('coverage.json'));
    } catch (e) {
      // nothing
    }

    new IdentifiersDocBuilder(data, tags, this._options).exec(writeFile, copyDir);
    new IndexDocBuilder(data, tags, this._options).exec(writeFile, copyDir);
    new ClassDocBuilder(data, tags, this._options).exec(writeFile, copyDir);
    new SingleDocBuilder(data, tags, this._options).exec(writeFile, copyDir);
    new FileDocBuilder(data, tags, this._options).exec(writeFile, copyDir);
    new StaticFileBuilder(data, tags, this._options).exec(writeFile, copyDir);
    new SearchIndexBuilder(data, tags, this._options).exec(writeFile, copyDir);
    new SourceDocBuilder(data, tags, this._options).exec(writeFile, copyDir, coverage);
    new ManualDocBuilder(data, tags, this._options).exec(writeFile, copyDir, readFile);

    const existTest = tags.find(tag => tag.kind.indexOf('test') === 0);
    if (existTest) {
      new TestDocBuilder(data, tags, this._options).exec(writeFile, copyDir);
      new TestFileDocBuilder(data, tags, this._options).exec(writeFile, copyDir);
    }
  }
}

module.exports = new Plugin();
