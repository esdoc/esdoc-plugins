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

## Builder options

Some of the builders have options to customize the build with.
The defaults are listed in the example below.

```json
{
  "name": "esdoc-publish-html-plugin",
  "option": {
    "template": "my-template",
    "globalOptions": { // optional
      "headerLinks": [ // optional
         { "text": "Example link", "href": "local-example-page.html#some-header", "cssClass": "my-example" },
         { "text": "Foo Bar", "href": "https://xkcd.com", "cssClass": "external-link" }
      ]
    },
    "builders": {
      "indetifiersDoc": {},
      "indexDoc": {},
      "classDoc": {},
      "singleDoc": {},
      "fileDoc": {},
      "staticFile": {},
      "searchIndex": {},
      "sourceDoc": {
        "coverageFilePath": "coverage.json"
      },
      "manual": {
        "badgeFileNamePatterns": [
            "(overview.*)",
            "(design.*)",
            "(installation.*)|(install.*)",
            "(usage.*)",
            "(configuration.*)|(config.*)",
            "(example.*)",
            "(faq.*)",
            "(changelog.*)"
        ]
      },
      "testDoc": {},
      "testFileDoc": {}
    }
  }
}
```

If the `builders` option is missing, all default plugins will be used with default configuration.

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
