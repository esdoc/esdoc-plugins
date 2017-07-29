# ESDoc Integrate Manual Plugin
## Install
```bash
npm install esdoc-integrate-manual-plugin
```

## Config
```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {
      "name": "esdoc-integrate-manual-plugin",
      "option": {
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
      }
    }
  ]
}
```

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
