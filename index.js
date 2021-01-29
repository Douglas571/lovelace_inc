'use strict'

// Wrapper configuration...
const initMongoose = require('./back-end/wrappers/mongoose.js')
const express = require('./back-end/wrappers/express.js')
const graphql = require('./back-end/graphql')
const playground = require('graphql-playground-middleware-express')
  .default

const rootDir = __dirname
const app = express('Lovelace inc.', rootDir)
initMongoose()

// Middlewar configs
app.use((req, res, next) => {
  console.log(req.url + ': ' + req.method)
  next()
})

const UserAuthSystem = require('./back-end/core/user-system.js')
const uas = new UserAuthSystem()
const ctrl = require('./back-end/controller')(uas)

app.use('/upload', ctrl.fileUpload)
app.use('/play', playground({endpoint: '/query'}))
app.use('/query', graphql)

app.use('/admin', ctrl.admin)
app.use('/', ctrl.user)

// set up the server
app.set('port', process.env.PORT || 4000)

switch (app.get('env')) {
  case 'production':
    console.log('Production')
    break
  case 'development':
    console.log('Development')
    break
  default:
    console.log('Unknow enviroment')
}

app.listen(app.get('port'), function () {
  console.log(`Lovelace is in ${app.get('env')} mode and launched in: http://localhost:${app.get('port')}; press Contrl + C to continue.`)
})
