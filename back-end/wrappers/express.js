//TO-DO: Pass all configs  of express here.

const express = require('express');
const handlebarsWrapper = require('./handlebars.js');

const OriginalExpress = require('express');
const session       = require('express-session');
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const flash         = require('connect-flash');

const cors = require('cors')

const sessionConfig = {
  secret: 'secret key',
  resave: false,
  saveUninitialized: true
};

function configViewEngine(app, dir){
	app.engine('hbs', handlebarsWrapper.engine);
	app.set('view engine', 'hbs')
	    .set('views', `${dir}/front-end/views`);
	
	return app;
}

const passport = require('passport');
module.exports = (name, dir) => {
	let app = express(name);

	app = configViewEngine(app, dir);

	app
		.use(express.static(`${dir}/front-end/public`))
		.use(session(sessionConfig))
    .use(bodyParser.json())
	  .use(bodyParser())
    .use(cookieParser())

    .use(passport.initialize())
    .use(passport.session())
    .use(flash())
    //Temporaly
    .use(cors())

	return app;
}