'use strict';

let admin = require('./handlers/admin.js');
let main = require('./handlers/main.js');

let userRoutes = require('express').Router();
let adminRouts = require('express').Router();

const navLinks = {
	home: 		'/',
	services: 	'/services',
	proyects: 	'/proyects',
	contact: 	'/contact',
	about: 		'/about'
}

function firstLetterUpperCase(text){
	return text[0].toUpperCase() + text.slice(1);
}

function setNavLinks(req, res, next){
	let links = {page: []};

	for(let name in navLinks){
		links.page.push({name: firstLetterUpperCase(name), 
							url: navLinks[name]});
	}

	res.locals.navLinks = links;
	next();
}

userRoutes
   .use(setNavLinks)
   .get('/about', main.about)
   .get('/contact', main.contact)
   .get('/proyects', main.proyects)
   .get('/services', main.services)
   .get('/', main.home);

adminRouts
   .get('/', admin.home)
   .use('/contact', admin.contact)
   .use('/blogUpdate', admin.blogUpdate);

exports.user = userRoutes;
exports.admin = adminRouts;