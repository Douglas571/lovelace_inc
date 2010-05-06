'use strict';

var express = require('express');
var vhost 	= require('vhost');
var router 	= require('./router.js');


var handlebars = require ('express-handlebars');
handlebars = handlebars.create({
					defaultLayout: 'main',
					extname: '.hbs'
				});

var app = express();

//Engine configs
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs')
	.set('views', `${__dirname}/views`);

// Middlewar configs
app.use(express.static(__dirname + "/public"));			
app.use(vhost('admin.*', router.admin));
app.use(router.user);

app.use('/', function(req, res) {
	res.render('home');
});

//set up the server
app.set('port', process.env.PORT || 3000)
app.listen(app.get('port'), function(){
	console.log(`Lovelace is launched in: ` + 
				`http://localhost:${app.get('port')}`);
});