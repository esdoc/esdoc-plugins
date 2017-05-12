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
        "lint": true,
        "coverage": true,
        "access": ["public", "protected", "private"],
        "autoPrivate": true,
        "undocumentIdentifier": true,
        "unexportedIdentifier": false,
        "title": "My Library",
        "repository": "https://github.com/foo/bar",
        "typeInference": true,
        "manual": {
          "index": "./manual/index.md",
          "globalIndex": true,
          "coverage": true,
          "asset": "./manual/asset",
          "overview": ["./manual/overview.md"],
          "design": ["./manual/design.md"],
          "installation": ["./manual/installation.md"],
          "usage": ["./manual/usage1.md", "./manual/usage2.md"],
          "tutorial": ["./manual/tutorial.md"],
          "configuration": ["./manual/configuration.md"],
          "example": ["./manual/example.md"],
          "advanced": ["./manual/advanced.md"],
          "faq": ["./manual/faq.md"],
          "changelog": ["./CHANGELOG.md"]
        }
      }
    }
  ]
}
```

The `esdoc-standard-plugin` is a glue plugin. The following plugins are used by this.
```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {"name": "esdoc-lint-plugin"},
    {"name": "esdoc-coverage-plugin"},
    {"name": "esdoc-accessor-plugin"},
    {"name": "esdoc-type-inference-plugin"},
    {"name": "esdoc-external-ecmascript-plugin"},
    {"name": "esdoc-brand-plugin"},
    {"name": "esdoc-undocumented-identifier-plugin"},
    {"name": "esdoc-unexported-identifier-plugin"},
    {"name": "esdoc-integrate-manual-plugin"},
    {"name": "esdoc-publish-html-plugin"}
  ]
}
```

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
