const fs = require('fs')
const path = require('path')

const typeDefs = fs.readFileSync(
  path.join(__dirname, 'type-defs.gql'),
  'utf8'
)

module.exports = typeDefs