# moleculer-sf-mixin-db

> mongoose adapter for `moleculer-sf`
> 
> export as plugin of [moleculer-sf](https://www.npmjs.com/package/moleculer-sf)

you need setup `process.env.MONGO_URI` or `service.settings.mongoURI`

## Changes

### v2

disable auto pluralize modelName by serviceName
```js
// if serviceSchema.modelName is null
const modelName = serviceSchema.name.replace(/\$/g, '')
```

## Usage
```js
// service-factory.js
const moleculer = require('moleculer')
const moleculerServiceFactory = require('moleculer-sf')
const moleculerSfMixinDb = require('moleculer-sf-mixin-db')

// global all factory plugins
const plugins = [
  // 'mixin-db', // or just string without prefix - v1
  moleculerSfMixinDb(false), // as function
]

module.exports = moleculerServiceFactory(moleculer, plugins)
```
