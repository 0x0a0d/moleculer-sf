# Moleculer Service Factory

    npm i moleculer-sf

## Idea

> This module uses [ServiceFactory](https://moleculer.services/docs/0.14/configuration.html#Broker-options) to hook, then returns a mixin that will be injected into the service's schema before service is created

> So instead of having to write (or copy) multiple lines of code, you just need to write it once and push into this module, great.

- For all services
```js
// service-factory.js
const moleculer = require('moleculer')
const { moleculerServiceFactory } = require('moleculer-sf')
const moleculerSfMixinDb = require('moleculer-sf-mixin-db')

// global all factory plugins
const plugins = [
  'catch-removed-event', // or with prefix moleculer-sf-catch-removed-event
  'prevent-change-created-at', // or require('moleculer-sf-prevent-change-created-at')
  // 'mixin-db', // or just string without prefix - v1
  moleculerSfMixinDb(false), // as function
]

module.exports = moleculerServiceFactory(moleculer, plugins)
```
P/S: do not forget to install factory dependencies
> **npm i moleculer-sf-mixin-db**

```js
// global appy to services
// moleculer.config.js
module.exports = {
  ServiceFactory: require('./service-factory.js'),
  // ...
}
```

```js
// - For excepted services
// some.service.js
module.exports = {
  name: 'some-service',
  schema: require('some-service-schema'),
  // $factory will be removed from schema before service created
  $factory: {
    global: false, // ignore global all-factory-plugins
    plugins: [
      'mixin-db', // add mixin-db only
    ]
  },
}
```

## Plugin module

Plugin module can be
- Function(serviceSchema, moleculer) => ServiceSchema or array of ServiceSchema

Service factory module will add all return `except null` from plugin

Structure
```js
module.exports = function(schema, moleculer) {
  // ...
  return {
    // $pluginOrder: Number.MAX_SAFE_INTEGER, // special: biggest will be placed at end of mixins array
    // actions
    // methods
    // settings
  }
}
```
+ $pluginOrder: see more at [merge algorithm](https://moleculer.services/docs/0.14/services.html#Merge-algorithm)
