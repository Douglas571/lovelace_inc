const initMongoose = require('./back-end/wrappers/mongoose.js')
const express = require('./back-end/wrappers/express.js')


//IN DEVELOPMENT, not in use rigth now.
class WebServer {
  constructor ({ rootDir, staticFiles }) {
    this.app = express('Lovelace inc.', rootDir)
    initMongoose()
    this.configureMidlewares()
  }

  configureMidlewares () {
    this.app.use((req, res, next) => {
      console.log(req.url + ': ' + req.method)
      next()
    })
  }

  listen () {
    const app = this.app
    app.listen(app.get('port'), function () {
      console.log(`Lovelace is in ${app.get('env')} mode and launched in: http://localhost:${app.get('port')}; press Contrl + C to continue.`)
    })
  }
}

module.exports = WebServer
