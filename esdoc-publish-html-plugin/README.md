# ESDoc Publish HTML Plugin
## Install
```bash
npm install esdoc-publish-html-plugin
```

## Config
```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {"name": "esdoc-publish-html-plugin"}
  ]
}
```

## Custom Template
To use a custom template (ex `my-template` placed in the working directory):
```json
    {"name": "esdoc-publish-html-plugin", "option": {"template": "my-template"}}
```

We recommend that you base on [the original template](https://github.com/esdoc/esdoc-plugins/tree/master/esdoc-publish-html-plugin/src/Builder/template).

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
