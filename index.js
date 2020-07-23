'use strict';

const http    = require('http');
const vhost   = require('vhost');

const router  = require('./controller/router.js');

//Wrapper configuration...
const handlebars = require('./controller/handlebars.js');
const mongoose = require('./controller/mongoose.js');
const express = require('./controller/express.js');

let rootDir = __dirname;
var app = express('Lovelace inc.', rootDir);

// Middlewar configs
app.use('/admin', router.admin);
app.use(router.user);

//set up the server
app.set('port', process.env.PORT || 3000);

switch(app.get('env')){
	case "production":
		console.log('Production');
		break;
	case "development":
		console.log('Development');
		break;
	default:
		console.log('Unknow enviroment');
}

http.createServer(app).listen(app.get('port'), function(){
		console.log('Lovelace is in "' + app.get('env') + 
					'" mode and launched in: http://localhost:' + app.get('port') +
					'; press Contrl + C to continue.');
});