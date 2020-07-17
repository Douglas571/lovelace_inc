'use strict';

let admin = require('./handlers/admin.js');
let main = require('./handlers/main.js');

let userRoutes = require('express').Router();
let adminRouts = require('express').Router();


const navLinks = {
	page: [
			{
				url: '/',
				name: 'Home'
			},
			{
				url: '/proyects',
				name: 'Proyects'
			},
			{
				url: '/services',
				name: 'Services'
			},
			{
				url: '/contact',
				name: 'Contact'
			},
			{
				url: '/about',
				name: 'About'
			}
		]
}

function setNavLinks(req, res, next){
	if(!res.locals.partials)
		res.locals.partials = {};

	res.locals.partials.navLinks = navLinks;
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