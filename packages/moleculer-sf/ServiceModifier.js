exports.ServiceModifier = class ServiceModifier {
  static assign(schema, fieldTarget, dataObj, overwrite = false) {
    schema[fieldTarget] = overwrite
      ? Object.assign({}, schema[fieldTarget], dataObj)
      : Object.assign({}, dataObj, schema[fieldTarget])
  }

  static concat(schema, fieldTarget, dataOrDataArray, insertToTop = false) {
    if (schema[fieldTarget] == null) {
      schema[fieldTarget] = [].concat(dataOrDataArray)
    } else {
      if (!Array.isArray(schema[fieldTarget])) {
        schema[fieldTarget] = [schema[fieldTarget]]
      }
      if (!Array.isArray(dataOrDataArray)) {
        dataOrDataArray = [dataOrDataArray]
      }
      const dataUniq = dataOrDataArray.filter(data => !schema[fieldTarget].includes(data))
      schema[fieldTarget] = insertToTop
        ? [].concat(dataUniq, schema[fieldTarget])
        : [].concat(schema[fieldTarget], dataUniq)
    }
  }
}
