# ESDoc React Plugin (PoC)
**This plugin is proof of concept.**
**So, the plugin has only minimum features.**
**We are waiting for your pull request!**

## Example
```js
/**
 * This is MyClass.
 * @reactProps {!number} prop1 - this is prop1
 * @reactProps {string} prop2 - this is prop2
 */
export default class MyClass extends React.Component {
}
```

<img src="https://raw.githubusercontent.com/esdoc/esdoc-plugins/master/esdoc-react-plugin/misc/ss.png" width="400px">

## Install
```bash
npm install esdoc-react-plugin
```

## Config
```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {"name": "esdoc-standard-plugin"},
    {"name": "esdoc-react-plugin"}
  ]
}
```

## Dependency
- esdoc-standard-plugin

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
