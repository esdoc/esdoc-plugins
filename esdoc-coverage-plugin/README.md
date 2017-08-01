# ESDoc Coverage Plugin
## Install
```
npm install esdoc-coverage-plugin
```

## Config
```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {
      "name": "esdoc-coverage-plugin", 
      "option": {
        "enable": true,
        "kind": ["class", "method", "member", "get", "set", "constructor", "function", "variable"]
      }
    }
  ]
}
```

`enable` is default `true`.

`kind` is default `["class", "method", "member", "get", "set", "constructor", "function", "variable"]`.

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
