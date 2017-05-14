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
        "source": "./test/",
        "interfaces": ["describe", "it", "context", "suite", "test"],
        "includes": ["(spec|Spec|test|Test)\\.js$"],
        "excludes": ["\\.config\\.js$"]
      }
    }
  ]
}
```

- `source` is required
- `interfaces` default is `["describe", "it", "context", "suite", "test"]`
- `includes` default is `["(spec|Spec|test|Test)\\.js$"]`
- `excludes` default is `["\\.config\\.js$"]`

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
