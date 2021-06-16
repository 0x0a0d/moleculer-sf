const Errors = require('moleculer').Errors

function extendClass(name, className) {
  return {
    [name]: class extends className {}
  }[name]
}

const $errors = new Proxy(Errors, {
  get(target, p) {
    if (typeof p !== 'string' || Object.prototype.hasOwnProperty.call(target, p)) {
      return target[p]
    }
    let classTarget = 'MoleculerError'
    if (p.endsWith('ClientError')) {
      classTarget = 'MoleculerClientError'
    }
    if (p.endsWith('RetryableError')) {
      classTarget = 'MoleculerRetryableError'
    }
    if (p.endsWith('ServerError')) {
      classTarget = 'MoleculerServerError'
    }
    return extendClass(p, target[classTarget])
  }
})

module.exports = () => ({
  $errors: $errors,
  created() {
    this.$errors = $errors
  }
})
