'use strict';

var express = require('express');
var vhost 	= require('vhost');
var router 	= require('./router.js');

/*
var app = express()
			.set('port', process.env.PORT || 3000)
			.set('view engine', 'pug')
			.set('views', './views');
	
app.use(express.static(__dirname + "/public"));			
app.use(vhost('admin.*', router.admin));
app.use(router.user);
*/



var hbs = require ('express-handlebars')
							.create({extname: '.hbs'});

var app = express();
app.set('port', 3000);

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.get('/hora', function(req, res){
	res.send('18-06-2020');
});

app.get('/', function(req, res){
	res.render('home', {name: 'Douglas'});
});

app.listen(app.get('port'), function(){
	console.log(`Lovelace is launched in: ` + 
				`http://localhost:${app.get('port')}`);
});