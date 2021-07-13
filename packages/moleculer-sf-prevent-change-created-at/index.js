module.exports = function(serviceSchema) {
  if (serviceSchema.schema != null) {
    serviceSchema.schema.plugin(function(dbSchema) {
      if (dbSchema.options.timestamps) {
        dbSchema.path(dbSchema.$timestamps.createdAt).immutable(true)
      }
    })
  }
}
