const pluralize = require('mongoose').Mongoose.prototype.pluralize()
const DbService	= require('moleculer-db')
const MongoAdapter = require('@cylution/moleculer-db-adapter-mongoose')

module.exports = (schema) => {
  if (schema.schema == null) {
    return
  }
  if (!Array.isArray(schema.mixins)) {
    schema.mixins = []
  } else if (schema.mixins.some(mixin => mixin.adapter != null)) {
    return
  }
  if (schema.modelName == null) {
    schema.modelName = pluralize(schema.name.replace(/\$/g, ''))
  }
  const settings = {}
  let mongoURI = process.env.MONGO_URI
  if (schema.settings != null && schema.settings.mongoURI) {
    mongoURI = schema.settings.mongoURI
    settings.$secureSettings = ['mongoURI']
  }
  if (mongoURI == null) {
    throw new Error(`Service '${schema.name}' missed settings.mongoURI`)
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
