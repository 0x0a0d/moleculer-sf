const pluralize = require('mongoose').Mongoose.prototype.pluralize()
const DbService = require('moleculer-db')
const MongoAdapter = require('@cylution/moleculer-db-adapter-mongoose')
const mongoose = require('mongoose')

module.exports = (pluralizeName = false) => {
  if (!pluralizeName) {
    mongoose.pluralize(null)
  }

  return (serviceSchema) => {
    if (serviceSchema.schema == null) {
      return
    }
    if (!Array.isArray(serviceSchema.mixins)) {
      serviceSchema.mixins = []
    } else if (serviceSchema.mixins.some(mixin => mixin.adapter != null)) {
      return
    }
    if (serviceSchema.modelName == null) {
      const modelName = serviceSchema.name.replace(/\$/g, '')
      serviceSchema.modelName = pluralizeName
        ? pluralize(modelName)
        : modelName
    }
    const settings = {}
    let mongoURI = process.env.MONGO_URI
    if (serviceSchema.settings != null && serviceSchema.settings.mongoURI) {
      mongoURI = serviceSchema.settings.mongoURI
      settings.$secureSettings = ['mongoURI']
    }
    if (mongoURI == null) {
      throw new Error(`Service '${serviceSchema.name}' missed mongoURI. Both process.env.MONGO_URI and service.settings.mongoURI are null`)
    }
    const adapter = new MongoAdapter(mongoURI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    return {
      $pluginOrder: Number.MAX_SAFE_INTEGER,
      adapter,
      mixins: [DbService],
      settings,
    }
  }
}
