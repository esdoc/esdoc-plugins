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
    {"name": "esdoc-brand-plugin"}
  ]
}
```

If you specify other title and repository, you can use `title` and `repository`.
```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {"name": "esdoc-brand-plugin", "option": {"title": "My Library Name", "repository": "https://github.com/foo/bar"}}
  ]
}
```

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
