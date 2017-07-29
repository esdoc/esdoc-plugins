# ESDoc Standard Plugin
## Install
```bash
npm install esdoc-standard-plugin
```

## Config
```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {
      "name": "esdoc-standard-plugin",
      "option": {
        "lint": {"enable": true},
        "coverage": {"enable": true},
        "accessor": {"access": ["public", "protected", "private"], "autoPrivate": true},
        "undocumentIdentifier": {"enable": true},
        "unexportedIdentifier": {"enable": false},
        "typeInference": {"enable": true},
        "brand": {
          "logo": "./logo.png",
          "title": "My Library",
          "description": "this is awesome library",
          "repository": "https://github.com/foo/bar",
          "site": "http://my-library.org",
          "author": "https://twitter.com/foo",
          "image": "http://my-library.org/logo.png"
        },
        "manual": {
          "index": "./manual/index.md",
          "globalIndex": true,
          "asset": "./manual/asset",
          "files": [
            "./manual/overview.md",
            "./manual/design.md",
            "./manual/installation.md",
            "./manual/usage1.md",
            "./manual/usage2.md",
            "./manual/tutorial.md",
            "./manual/configuration.md",
            "./manual/example.md",
            "./manual/advanced.md",
            "./manual/faq.md",
            "./CHANGELOG.md"
          ]
        },
        "test": {
          "source": "./test/",
          "interfaces": ["describe", "it", "context", "suite", "test"],
          "includes": ["(spec|Spec|test|Test)\\.js$"],
          "excludes": ["\\.config\\.js$"]
        }
      }
    }
  ]
}
```

The `esdoc-standard-plugin` is a glue plugin. The following plugins are used by this.
- [esdoc-lint-plugin](https://github.com/esdoc/esdoc-plugins/tree/master/esdoc-lint-plugin)
- [esdoc-coverage-plugin](https://github.com/esdoc/esdoc-plugins/tree/master/esdoc-coverage-plugin)
- [esdoc-accessor-plugin](https://github.com/esdoc/esdoc-plugins/tree/master/esdoc-accessor-plugin)
- [esdoc-type-inference-plugin](https://github.com/esdoc/esdoc-plugins/tree/master/esdoc-type-inference-plugin)
- [esdoc-external-ecmascript-plugin](https://github.com/esdoc/esdoc-plugins/tree/master/esdoc-external-ecmascript-plugin)
- [esdoc-brand-plugin](https://github.com/esdoc/esdoc-plugins/tree/master/esdoc-brand-plugin)
- [esdoc-undocumented-identifier-plugin](https://github.com/esdoc/esdoc-plugins/tree/master/esdoc-undocumented-identifier-plugin)
- [esdoc-unexported-identifier-plugin](https://github.com/esdoc/esdoc-plugins/tree/master/esdoc-unexported-identifier-plugin)
- [esdoc-integrate-manual-plugin](https://github.com/esdoc/esdoc-plugins/tree/master/esdoc-integrate-manual-plugin)
- [esdoc-integrate-test-plugin](https://github.com/esdoc/esdoc-plugins/tree/master/esdoc-integrate-test-plugin)
- [esdoc-publish-html-plugin](https://github.com/esdoc/esdoc-plugins/tree/master/esdoc-publish-html-plugin)

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
