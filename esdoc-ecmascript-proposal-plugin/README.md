# ESDoc ECMAScript Proposal Plugin
## Install
```
npm install esdoc-ecmascript-proposal-plugin
```

## Config
```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {"name": "esdoc-ecmascript-proposal-plugin", "option": {"all": true}}
  ]
}
```

If you want to enable each proposals,
```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {
      "name": "esdoc-ecmascript-proposal-plugin",
      "option": {
        "asyncGenerators":  true,
        "bigInt": true,
        "classProperties":  true,
        "classPrivateProperties": true,
        "classPrivateMethods":  true,
        "decorators": true,
        "decorators-legacy": true,
        "doExpressions": true,
        "dynamicImport":  true,
        "exportDefaultFrom": true,
        "exportNamespaceFrom":  true,
        "functionBind": true,
        "functionSent":  true,
        "importMeta": true,
        "logicalAssignment":  true,
        "nullishCoalescingOperator": true,
        "numericSeparator":  true,
        "objectRestSpread": true,
        "optionalCatchBinding":  true,
        "optionalChaining": true,
        "pipelineOperator":  true,
        "throwExpressions": true,
      }
    }
  ]
}
```

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
