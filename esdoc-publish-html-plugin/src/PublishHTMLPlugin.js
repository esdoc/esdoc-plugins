import {taffy} from 'taffydb';
import IceCap from 'ice-cap';
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

export default class PublishHTMLPlugin {
  constructor(option = {}) {
    this._option = option;
  }

  exec(tags, writeFile, copyDir, readFile) {
    IceCap.debug = !!this._option.debug;

    const data = taffy(tags);

    let coverage = null;
    try {
      coverage = JSON.parse(readFile('coverage.json'));
    } catch (e) {
      // nothing
    }

    new IdentifiersDocBuilder(data, tags).exec(writeFile, copyDir);
    new IndexDocBuilder(data, tags).exec(writeFile, copyDir);
    new ClassDocBuilder(data, tags).exec(writeFile, copyDir);
    new SingleDocBuilder(data, tags).exec(writeFile, copyDir);
    new FileDocBuilder(data, tags).exec(writeFile, copyDir);
    new StaticFileBuilder(data, tags).exec(writeFile, copyDir);
    new SearchIndexBuilder(data, tags).exec(writeFile, copyDir);
    new SourceDocBuilder(data, tags).exec(writeFile, copyDir, coverage);
    new ManualDocBuilder(data, tags).exec(writeFile, copyDir, readFile);

    const existTest = tags.find(tag => tag.kind.indexOf('test') === 0);
    if (existTest) {
      new TestDocBuilder(data, tags).exec(writeFile, copyDir);
      new TestFileDocBuilder(data, tags).exec(writeFile, copyDir);
    }
  }
}
