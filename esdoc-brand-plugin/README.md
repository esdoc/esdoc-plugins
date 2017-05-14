# ESDoc Brand Plugin
## Install
```bash
npm install esdoc-brand-plugin
```

## Config
This plugin takes a title and a repository from `package.json (name, repsitory)`.
```json
{
  "source": "./src",
  "destination": "./doc",
  "package.json": "./package.json",
  "plugins": [
    {
      "name": "esdoc-brand-plugin",
      "option": {
        "logo": "./logo.png",
        "title": "My Library Name",
        "repository": "https://github.com/foo/bar"
      }
    }
  ]
}
```

- `logo` default is `null`
- `title` default is `name` of `package.json`
- `repository` default is `repository` of `package.json`

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
