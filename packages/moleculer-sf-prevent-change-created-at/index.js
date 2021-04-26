function createHook({createdAt, updatedAt}) {
  return function() {
    const now = Date.now()
    this[createdAt] = now
    this[updatedAt] = now
  }
}
function addHook(schema) {
  const hook = createHook(schema.$timestamps)
  const hookStr = hook.toString()
  try {
    if (schema.s.hooks._pres.get('save').slice(1).some(({fn}) => fn.toString() === hookStr)) {
      return
    }
  } catch (e) {}
  schema.pre('save', hook)
}
module.exports = function(schema) {
  if (schema.schema == null) {
    return
  }
  if (!schema.schema.options.timestamps) {
    return
  }

  schema.schema.add({
    [schema.schema.$timestamps.createdAt]: {
      type: Date,
      immutable: true,
    }
  })
  addHook(schema.schema)
}
