const mongoose = require('mongoose')
const pluralize = mongoose.Mongoose.prototype.pluralize()

// catchRemovedEventGenerate -- start
/**
 * @typedef {object} catchRemovedEventOptions
 * @property {string} service
 * @property {string} [modelName]
 * @property {string} [group]
 */

function getModelName(catchRemovedEventOptions) {
  return catchRemovedEventOptions.modelName == null ? pluralize(catchRemovedEventOptions.service) : catchRemovedEventOptions.modelName
}

/**
 * @param {catchRemovedEventOptions} catchRemovedEventOptions
 * @param {mongoose.Schema} schema
 * @param [results]
 * @param [paths]
 * @param [inArray]
 * @return {*[]}
 */
exports.buildQueryPaths = function buildQueryPaths(catchRemovedEventOptions, schema, results = [], paths = [], inArray = false) {
  if (schema instanceof mongoose.Schema) {
    buildQueryPaths(catchRemovedEventOptions, schema.obj, results, paths, inArray)
  } else {
    const modelName = getModelName(catchRemovedEventOptions)
    for (const key in schema) {
      if (Object.prototype.hasOwnProperty.call(schema, key)) {
        if (schema[key].type === mongoose.Types.ObjectId) {
          if (schema[key].ref === modelName) {
            results.push({
              field: key,
              paths: paths.join('.'),
              inArray,
            })
          } else if (schema[key].refPath != null) {
            const refPath = schema[key].refPath
            if (schema[refPath] !== null) {
              if (Array.isArray(schema[refPath].enum) && schema[refPath].enum.includes(modelName)) {
                results.push({
                  field: key,
                  paths: paths.join('.'),
                  refPath,
                  inArray,
                })
              }
            }
          }
        } else if (Array.isArray(schema[key])) {
          schema[key].forEach(child => buildQueryPaths(catchRemovedEventOptions, child, results, paths.concat(key), true))
        }
      }
    }
  }
  return results
}
/**
 * @param queryPaths
 * @param {catchRemovedEventOptions} catchRemovedEventOptions
 * @return {Object}
 */
exports.createEvent = function createEvent(queryPaths, catchRemovedEventOptions) {
  const modelName = getModelName(catchRemovedEventOptions)
  const eventDef = {
    params: {
      id: {
        type: 'objectID',
      }
    },
    handler(ctx) {
      const queries = queryPaths.map(({ field, refPath, paths, inArray }) => {
        const filter = {
          [paths + '.' + field]: ctx.params.id
        }
        if (refPath != null) {
          filter[refPath] = modelName
        }
        if (inArray) {
          return {
            updateMany: {
              filter,
              update: {
                $pull: {
                  [paths]: {
                    [field]: ctx.params.id
                  }
                }
              }
            }
          }
        } else {
          return {
            deleteMany: {
              filter
            }
          }
        }
      })
      return this.adapter.model.bulkWrite(queries).then(({ acknowledged, deletedCount, insertedCount, upsertedCount, matchedCount }) => {
        if (acknowledged) {
          if (
            deletedCount > 0 ||
            insertedCount > 0 ||
            upsertedCount > 0 ||
            matchedCount > 0
          ) {
            return this.clearCache()
          }
        }
      }).then(() => {}).catch(() => {})
    }
  }
  if (catchRemovedEventOptions.group != null) {
    eventDef.group = catchRemovedEventOptions.group
  }
  return eventDef
}
// catchRemovedEventGenerate -- end
