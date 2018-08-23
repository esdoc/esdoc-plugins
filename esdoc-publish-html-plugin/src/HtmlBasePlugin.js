import path from 'path';
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

export default class HtmlBasePlugin {

    constructor() {
        this.defaultBuilderSet = [
            "indetifiersDoc",
            "indexDoc",
            "classDoc",
            "singleDoc",
            "fileDoc",
            "staticFile",
            "searchIndex",
            "sourceDoc",
            "manual",
            "testDoc",
            "testFileDoc"
        ];

        // helper method to remove boilerplate.
        const builder = (clazz) => ((template, data, tags, builderOpts, globalOpts) =>
            new clazz(template, data, tags, builderOpts, globalOpts));

        // Plugins can extend this Plugin and add custom builders.
        this.builders = {
            indetifiersDoc: builder(IdentifiersDocBuilder),
            indexDoc:       builder(IndexDocBuilder),
            classDoc:       builder(ClassDocBuilder),
            singleDoc:      builder(SingleDocBuilder),
            fileDoc:        builder(FileDocBuilder),
            staticFile:     builder(StaticFileBuilder),
            searchIndex:    builder(SearchIndexBuilder),
            sourceDoc:      builder(SourceDocBuilder),
            manual:         builder(ManualDocBuilder),
            testDoc:        builder(TestDocBuilder),
            testFileDoc:    builder(TestFileDocBuilder)
        };
    }

    onHandleDocs(ev) {
        this._docs = ev.data.docs;
    }

    onPublish(ev) {
        this._option = ev.data.option || {};
        this._template = typeof this._option.template === 'string'
            ? path.resolve(process.cwd(), this._option.template)
            : path.resolve(__dirname, './Builder/template');
        this._exec(this._docs, ev.data.writeFile, ev.data.copyDir, ev.data.readFile);
    }

    _exec(tags, writeFile, copyDir, readFile) {
        IceCap.debug = !!this._option.debug;

        const data = taffy(tags);

        //bad hack: for other plugin uses builder.
        DocBuilder.createDefaultBuilder = () => {
            return new DocBuilder(this._template, data, tags, null, null);
        };

        const builderUtil = {writeFile, copyDir, readFile};

        // An object, keys: builder names, values: builder options, if any.
        let builderSet = this.defaultBuilderSet;
        if (this._option.builders) builderSet = Object.keys(this._option.builders);

        const globalOpts = this._option.globalOptions || {};

        // Get the options for all builders, may be null.
        const buildersOptions = this._option.builders || {};

        // Iterate over every configured builder
        // Note: test-only builders will check for a "test" tag themselves, and exit immediately if it cannot be found.
        for (const builderName of builderSet) {
            const builderCreator = this.builders[builderName];
            if (!builderCreator) {
                console.log(`Warning: esdoc-publish-html-plugin does not recognize a builder: ${builderName}.`)
            } else {
                // Get a new instance of the builder.
                const builder = builderCreator(this._template, data, tags,
                    buildersOptions[builderName] || {}, globalOpts);
                // Run the builder, it will build using the util
                builder.exec(builderUtil);
            }
        }
    }
}

