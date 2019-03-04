'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _DocBuilder = require('./DocBuilder.js');

var _DocBuilder2 = _interopRequireDefault(_DocBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Static file output builder class.
 */
class StaticFileBuilder extends _DocBuilder2.default {
  exec(writeFile, copyDir) {
    copyDir(_path2.default.resolve(this._template, 'css'), './css');
    copyDir(_path2.default.resolve(this._template, 'script'), './script');
    copyDir(_path2.default.resolve(this._template, 'image'), './image');
  }
}
exports.default = StaticFileBuilder;