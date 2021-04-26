const mongoose = require('../src/backend/node_modules/mongoose')

const pluralize = mongoose.Mongoose.prototype.pluralize()
console.log(pluralize('profile'));
