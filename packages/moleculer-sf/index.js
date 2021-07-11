const { applyPlugins } = require('./helper')
const { ServiceModifier } = require('./ServiceModifier')

const moleculerServiceFactory = (moleculer, plugins) => class Service extends moleculer.Service {
  constructor(broker, schema) {
    if (!(
      schema == null ||
      schema.name == null ||
      schema.name.startsWith('$')
    )) {
      let schemaPlugins = []
      if (schema.$factory == null || schema.$factory.global !== false) {
        // apply global plugins
        schemaPlugins = schemaPlugins.concat(applyPlugins(plugins, schema, moleculer))
      }
      if (schema.$factory != null && schema.$factory.plugins) {
        schemaPlugins = schemaPlugins.concat(applyPlugins(schema.$factory.plugins, schema, moleculer))
      }
      if (schemaPlugins.length) {
        ServiceModifier.concat(schema, 'mixins', schemaPlugins)
      }
      delete schema.$factory
    }
    super(broker, schema)
  }
}

module.exports = moleculerServiceFactory
