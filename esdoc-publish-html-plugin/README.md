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

To use a custom template (ex `my-template` placed in the working directory):
```json
    {"name": "esdoc-publish-html-plugin", "option": {"template": "my-template"}}
```

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
