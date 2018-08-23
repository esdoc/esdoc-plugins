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

        // Plugins can extend this Plugin and add custom builders.
        this.builders = {
            indetifiersDoc: (template, data, tags) => new IdentifiersDocBuilder(template, data, tags),
            indexDoc: (template, data, tags) => new IndexDocBuilder(template, data, tags),
            classDoc: (template, data, tags) => new ClassDocBuilder(template, data, tags),
            singleDoc: (template, data, tags) => new SingleDocBuilder(template, data, tags),
            fileDoc: (template, data, tags) => new FileDocBuilder(template, data, tags),
            staticFile: (template, data, tags) => new StaticFileBuilder(template, data, tags),
            searchIndex: (template, data, tags) => new SearchIndexBuilder(template, data, tags),
            sourceDoc: (template, data, tags) => new SourceDocBuilder(template, data, tags),
            manual: (template, data, tags) => new ManualDocBuilder(template, data, tags),
            testDoc: (template, data, tags) => new TestDocBuilder(template, data, tags),
            testFileDoc: (template, data, tags) => new TestFileDocBuilder(template, data, tags)
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
            return new DocBuilder(this._template, data, tags);
        };

        const builderUtil = {writeFile, copyDir, readFile};

        // An object, keys: builder names, values: builder options, if any.
        let builderSet = this.defaultBuilderSet;
        if (this._option.builders) builderSet = Object.keys(this._option.builders);

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
                const builder = builderCreator(this._template, data, tags);
                // Run the builder, it will build using the util,
                // and with the options as configured by the user
                // (fallback to empty object, builder can document and set defaults in a destructured object param)
                builder.exec(builderUtil, buildersOptions[builderName] || {});
            }
        }
    }
}

