/* eslint-disable max-lines */
import fs from 'fs';
import path from 'path';
import IceCap from 'ice-cap';
import NPMUtil from 'esdoc/out/src/Util/NPMUtil.js';

/**
 * Builder base class.
 */
export default class Builder {
    /**
     * Create builder base instance.
     * @param {String} template - template absolute path
     * @param {Taffy} data - doc object database.
     * @param tags -
     */
    constructor(template, data, tags) {
        this._template = template;
        this._data = data;
        this._tags = tags;
    }

    /* eslint-disable no-unused-vars */
    /**
     * execute building output.
     * @abstract
     * @param builderUtil Utility functions to build with.
     * @param builderUtil.writeFile {function(html: string, filePath: string)} - to write files with.
     * @param builderUtil.copyDir {function(src: string, dest: string)} - to copy directories with.
     * @param builderUtil.readFile {function(filePath: string): string} - to read files with.
     * @param builderOptions {object} - options/data specific to the builder.
     */
    exec({writeFile, copyDir, readFile}, builderOptions) {
    }

    /**
     * read html template.
     * @param {string} fileName - template file name.
     * @return {string} html of template.
     * @protected
     */
    _readTemplate(fileName) {
        const filePath = path.resolve(this._template, `./${fileName}`);
        return fs.readFileSync(filePath, {encoding: 'utf-8'});
    }


    /**
     * get output html page title.
     * @param {DocObject} doc - target doc object.
     * @returns {string} page title.
     * @private
     */
    _getTitle(doc = '') {
        const name = doc.name || doc.toString();

        if (name) {
            return `${name}`;
        } else {
            return '';
        }
    }

    /**
     * get base url html page. it is used html base tag.
     * @param {string} fileName - output file path.
     * @returns {string} base url.
     * @protected
     */
    _getBaseUrl(fileName) {
        const baseUrl = '../'.repeat(fileName.split('/').length - 1);
        return baseUrl;
    }

    /**
     * build common layout output.
     * @return {IceCap} layout output.
     * @private
     */
    _buildLayoutDoc() {
        const ice = new IceCap(this._readTemplate('layout.html'), {autoClose: false});

        const packageObj = NPMUtil.findPackage();
        if (packageObj) {
            ice.text('esdocVersion', `(${packageObj.version})`);
        } else {
            ice.drop('esdocVersion');
        }

        const existTest = this._tags.find(tag => tag.kind.indexOf('test') === 0);
        ice.drop('testLink', !existTest);

        const existManual = this._tags.find(tag => tag.kind.indexOf('manual') === 0);
        ice.drop('manualHeaderLink', !existManual);

        const manualIndex = this._tags.find(tag => tag.kind === 'manualIndex');
        if (manualIndex && manualIndex.globalIndex) {
            ice.drop('manualHeaderLink');
        }

        ice.load('nav', this._buildNavDoc());
        return ice;
    }

    _buildNavDoc() {
        const html = this._readTemplate('nav.html');
        return new IceCap(html);
        // TODO: maybe fill nav with something by default?
    }
}