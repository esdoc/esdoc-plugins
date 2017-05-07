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
  ]
}
```

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
