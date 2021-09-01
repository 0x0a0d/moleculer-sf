const moleculer = require('moleculer')

exports.applyPlugins = function(plugins, schema) {
  plugins = [].concat(plugins || [])
  if (plugins.length === 0) {
    return []
  }
  return plugins
    .map(plugin => {
      if (typeof plugin === 'string') {
        if (!plugin.startsWith('moleculer-sf-')) {
          plugin = 'moleculer-sf-' + plugin
        }
        plugin = require.main.require(plugin)
      }
      if (typeof plugin === 'function') {
        return plugin(schema, moleculer)
      }
      return plugin
    })
    .filter(schemaPlugin => schemaPlugin != null)
    .reduce((arr, p) => arr.concat(p), [])
    .sort((a, b) => {
      const aOrder = a.$pluginOrder == null ? 1000 : a.$pluginOrder
      const bOrder = b.$pluginOrder == null ? 1000 : b.$pluginOrder
      if (aOrder <= bOrder) {
        return -1
      } else {
        return 1
      }
    })
    .map(schemaPlugin => {
      delete schemaPlugin.$pluginOrder
      return schemaPlugin
    })
}
