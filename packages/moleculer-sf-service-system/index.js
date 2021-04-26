module.exports = function(schema) {
  if (schema.name === 'system') {
    return
  }
  return {
    settings: {
      $secureSettings: [
        'system', // response from system
        'systemKeys',
      ]
    },
    methods: {
      _updateConfig: function() {
        const systemKeys = this.settings.systemKeys.concat(this.name)
        const query = {}
        if (systemKeys.length > 1) {
          query.$or = systemKeys.map(key => {
            return {
              key: new RegExp(`^${key}\.`)
            }
          })
        } else {
          query.key = new RegExp(`^${systemKeys[0]}\.`)
        }
        return this.broker.call('system.find', {
          query
        }).then(configs => {
          this.settings.system = configs
        })
      },
    },
    events: {
      'system.changed': function() {
        return this._updateConfig()
      }
    },
    started: function() {
      return this._updateConfig()
    },
    dependencies: [
      'system',
    ]
  }
}
