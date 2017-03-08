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
        "title": "My Library",
        "repository": "https://github.com/foo/bar"
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
    {"name": "esdoc-external-ecmascript-plugin"},
    {"name": "esdoc-brand-plugin"},
    {"name": "esdoc-undocumented-identifier-plugin"},
    {"name": "esdoc-publish-html-plugin"}
  ]
}
```

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
