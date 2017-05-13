# ESDoc Integrate Test Plugin
## Install
```bash
npm install esdoc-integrate-test-plugin
```

## Config
```json
{
  "source": "./src",
  "destination": "./docs",
  "plugins": [
    {
      "name": "esdoc-integrate-test-plugin",
      "option": {
        "type": "mocha",
        "source": "./test/",
        "includes": ["(spec|Spec|test|Test)\\.js$"],
        "excludes": ["\\.config\\.js$"]
      }
    }
  ]
}
```

- `type` is required. Now, only `mocha`
- `source` is required
- `includes` is default `["(spec|Spec|test|Test)\\.js$"]`
- `excludes` is default `["\\.config\\.js$"]`

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
