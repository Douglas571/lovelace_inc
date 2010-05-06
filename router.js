'use strict'
var admin = require('./handlers/admin.js');
var main = require('./handlers/main.js');


var userRoutes = require('express').Router();
var adminRouts = require('express').Router();


userRoutes
	.get('/about', main.about)
	.get('/contact', main.contact)
	.get('/portfolio', main.portfolio)
	.get('/services', main.services)
	.get('/', main.home);

adminRouts.get('/', admin.home);

exports.user = userRoutes;
exports.admin = adminRouts;