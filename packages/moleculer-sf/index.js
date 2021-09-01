const { applyPlugins } = require('./helper')
const { ServiceModifier } = require('./ServiceModifier')
const { Service } = require('moleculer')

const moleculerServiceFactory = (plugins) => class ServiceFactory extends Service {
  constructor(broker, serviceSchema) {
    if (!(
      serviceSchema == null ||
      serviceSchema.name == null ||
      serviceSchema.name.startsWith('$') ||
      serviceSchema.$factory === false
    )) {
      let extraPlugins = []
      if (serviceSchema.$factory == null) {
        extraPlugins = extraPlugins.concat(plugins)
      } else {
        if (serviceSchema.$factory.global !== false) {
          extraPlugins = extraPlugins.concat(plugins)
        }
        if (serviceSchema.$factory.plugins) {
          extraPlugins = extraPlugins.concat(serviceSchema.$factory.plugins)
        }
      }
      const schemaPlugins = extraPlugins.length
        ? applyPlugins(extraPlugins, serviceSchema)
        : []

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
            delete schemaPlugin.settings
          }
          return settings
        }, serviceSchema.settings || {})
        ServiceModifier.concat(serviceSchema, 'mixins', schemaPlugins)
      }
      delete serviceSchema.$factory
    }
    super(broker, serviceSchema)
  }
}

exports.moleculerServiceFactory = moleculerServiceFactory
