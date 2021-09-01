const moleculer = require('moleculer')
const { applyPlugins } = require('./helper')
const { ServiceModifier } = require('./ServiceModifier')

const moleculerServiceFactory = (globalPlugins, customPlugins = {}) => {
  globalPlugins = [].concat(globalPlugins || [])

  return class Service extends moleculer.Service {
    constructor(broker, serviceSchema) {
      if (!(
        serviceSchema == null ||
        serviceSchema.name == null ||
        serviceSchema.name.startsWith('$')
      )) {
        const extra = {
          plugins: [],
          mixins: []
        }
        if (serviceSchema.$factory !== false) {
          if (serviceSchema.$factory == null) {
            extra.plugins.push(...globalPlugins)
          } else {
            if (serviceSchema.$factory === true || serviceSchema.$factory.global !== false) {
              extra.plugins.push(...globalPlugins)
            }
            if (serviceSchema.$factory.mixins) {
              extra.mixins.push(...[].concat(serviceSchema.$factory.mixins))
            }
          }
        }
        const extraSchemas = applyPlugins(extra.plugins, serviceSchema)
        extraSchemas.push(...extra.mixins.reduce((arr, mixin) => {
          let res
          if (typeof mixin === 'string') {
            res = customPlugins[mixin](serviceSchema)
          } else if (typeof mixin === 'function') {
            res = mixin(serviceSchema)
          } else {
            const { name, options } = mixin
            res = customPlugins[name](serviceSchema, options)
          }
          if (res != null) {
            arr.push(res)
          }
          return arr
        }, []))

        if (extraSchemas.length) {
          serviceSchema.settings = extraSchemas.reduce((settings, extraSchema) => {
            if (extraSchema.settings) {
              Object
                .entries(extraSchema.settings)
                .forEach(([key, settingValue]) => {
                  if (settings[key] == null || settingValue == null) {
                    settings[key] = settingValue
                    return
                  }
                  if (Array.isArray(settings[key]) || Array.isArray(settingValue)) {
                    settings[key] = [].concat(settings[key], settingValue).filter(x => x != null)
                    return
                  }
                  if (typeof settings[key] === 'object' && typeof settingValue === 'object') {
                    settings[key] = Object.assign({}, settings[key], settingValue)
                    return
                  }
                  settings[key] = settingValue
                })
              delete extraSchema.settings
            }
            return settings
          }, serviceSchema.settings || {})
          ServiceModifier.concat(serviceSchema, 'mixins', extraSchemas)
        }
        // delete serviceSchema.$factory
      }
      super(broker, serviceSchema)
    }
  }
}

exports.moleculerServiceFactory = moleculerServiceFactory
