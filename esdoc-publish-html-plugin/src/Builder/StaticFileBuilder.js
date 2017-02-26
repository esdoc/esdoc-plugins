import path from 'path';
import DocBuilder from './DocBuilder.js';

/**
 * Static file output builder class.
 */
export default class StaticFileBuilder extends DocBuilder {
  exec(writeFile, copyDir) {
    copyDir(path.resolve(__dirname, './template/css'), './css');
    copyDir(path.resolve(__dirname, './template/script'), './script');
    copyDir(path.resolve(__dirname, './template/image'), './image');
  }
}
