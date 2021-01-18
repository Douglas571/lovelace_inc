"use strict";

const http    = require('http');
const vhost   = require('vhost');

//Wrapper configuration...
const handlebars = require('./wrappers/handlebars.js');
const mongoose = require('./wrappers/mongoose.js');
const express = require('./wrappers/express.js');

let rootDir = __dirname;
var app = express('Lovelace inc.', rootDir);

// Middlewar configs
app.use((req, res, next) => {
	console.log(req.url + ': ' + req.method)
	next()
});

const UserAuthSystem = require('./core/user-system.js')
const uas = new UserAuthSystem();
const ctrl  = require('./controller')(uas);

app.use('/admin', ctrl.admin);
app.use('/', ctrl.user);

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