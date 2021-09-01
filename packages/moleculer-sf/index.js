const moleculer = require('moleculer')
const { applyPlugins } = require('./helper')
const { ServiceModifier } = require('./ServiceModifier')

const moleculerServiceFactory = (plugins, mixins) => {
  plugins = [].concat(plugins || [])
  mixins = [].concat(mixins || [])

  return class Service extends moleculer.Service {
    constructor(broker, serviceSchema) {
      if (!(
        serviceSchema == null ||
        serviceSchema.name == null ||
        serviceSchema.name.startsWith('$') ||
        serviceSchema.$factory === false
      )) {
        const extra = {
          plugins: [],
          mixins: []
        }
        if (serviceSchema.$factory == null || serviceSchema.$factory === true) {
          extra.plugins.push(...plugins)
        } else if (serviceSchema.$factory !== false) {
          if (serviceSchema.$factory.global !== false) {
            extra.plugins.push(...plugins)
          }
          if (serviceSchema.$factory.plugins) {
            extra.plugins.push(...[].concat(serviceSchema.$factory.plugins))
          }
        }
        const schemaPlugins = applyPlugins(extra.plugins, serviceSchema)

        if (schemaPlugins.length) {
          serviceSchema.settings = schemaPlugins.reduce((settings, schemaPlugin) => {
            if (schemaPlugin.settings) {
              Object
                .entries(schemaPlugin.settings)
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
              // delete schemaPlugin.settings
            }
            return settings
          }, serviceSchema.settings || {})
          ServiceModifier.concat(serviceSchema, 'mixins', schemaPlugins)
        }
        if (extra.mixins.length) {
          extra.mixins.forEach(mixin => {
            if (typeof mixin === 'string') {
              mixins[mixin](serviceSchema)
            } else {
              const { name, options } = mixin
              mixins[name](serviceSchema, options)
            }
          })
        }
        // delete serviceSchema.$factory
      }
      super(broker, serviceSchema)
    }
  }
}

exports.moleculerServiceFactory = moleculerServiceFactory
