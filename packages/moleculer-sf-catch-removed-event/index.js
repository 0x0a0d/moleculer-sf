const { createEvent, buildQueryPaths } = require('./helper')

module.exports = schema => {
  if (schema.settings == null || schema.settings.$catchRemovedEvents == null) {
    return
  }
  if (!Array.isArray(schema.settings.$catchRemovedEvents)) {
    schema.settings.$catchRemovedEvents = [schema.settings.$catchRemovedEvents]
  }
  const events = schema.settings.$catchRemovedEvents.reduce((events, catchRemovedEventOptions) => {
    const queryPaths = buildQueryPaths(catchRemovedEventOptions, schema.schema)
    events[`${catchRemovedEventOptions.service}.removed`] = createEvent(queryPaths, catchRemovedEventOptions)
    return events
  })
  delete schema.settings.$catchRemovedEvents
  return {
    events
  }
}
