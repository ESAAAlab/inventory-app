# inventory-app

Tool lending app, frontend to [inventory-server](https://github.com/ESAAAlab/inventory-server)

![screenshot](https://raw.githubusercontent.com/ESAAAlab/inventory-app/master/screenshot.png)

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# build electron application for production (all platforms)
npm run build:cross

# build electron application for web server in ../inventory-server/www folder
npm run build:web

# lint all JS/Vue component files in `src/`
npm run lint
```

#### Environnement variables to set

``` bash
# inventory-server API endpoint location for production and development
INVENTORY_BASE_URL_PROD : 'http://localhost:3000/api/v1'
INVENTORY_BASE_URL_DEV : 'http://localhost:3000/api/v1'
```
---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[b31b441](https://github.com/SimulatedGREG/electron-vue/tree/b31b44123ad42acac12337c4955df4ead853f0df) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
