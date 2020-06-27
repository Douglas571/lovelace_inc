'use strict';

var http    = require('http');
var express = require('express');
var vhost 	= require('vhost');
var router 	= require('./router.js');


var handlebars = require ('express-handlebars');

//Handlebars Configuration
handlebars = handlebars.create({
					defaultLayout: 'main',
					extname: '.hbs',
					helpers: {
						section: function(name, options) {
							if(!this._sections) this._sections = {};
							this._sections[name] = options.fn(this);
							return null;
						}
					}
				});

var app = express();

//Engine configs
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs')
	.set('views', `${__dirname}/views`);

// Middlewar configs
app.use(require('body-parser')());
app.use(express.static(__dirname + "/public"));			
app.use(vhost('admin.*', router.admin));
app.use(router.user);

app.use('/data', function(req, res) {
	console.log(`form: ${req.body.form}\nnombre: ${req.body.nombre}\nmensage: ${req.body.mensage}`);

	{
		var s = '';
		for (var name in req.headers)
			s += `${name}: ${req.headers[name]}\n`;
		console.log(s);
	}
	res.set('Content-Type', 'text/html');
	res.send('Gracias por escojernos, su solicitud será porcesada lo más pronto posible');
		
});

//set up the server
app.set('port', process.env.PORT || 3000)

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

http.createServer(app)
	.listen(app.get('port'), function(){
		console.log('Lovelace is in "' + app.get('env') + 
					'" mode and launched in: http://localhost:' + app.get('port') +
					'; press Contrl + C to continue.');
	});