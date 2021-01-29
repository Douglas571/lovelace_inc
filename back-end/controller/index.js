'use strict';

let adminHandler = require('./handlers/admin.js');
let articlesHandler = require('./handlers/admin/articles-handler');
let main = require('./handlers/main.js');

let userRoutes = require('express').Router();
let adminRoutes = require('express').Router();
let security = require('express').Router();

const navLinks = {
	home: 		'/',
	services: 	'/services',
	portfolio: 	'/portfolio',
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



module.exports = function(userSystem) {

  adminRoutes
    .route('/articulo')
      .get(adminHandler.viewAllArticles)
      .post(adminHandler.createArticle);

  adminRoutes
    .route('/articulo/:id')
      .get(adminHandler.viewArticle)
      .post(adminHandler.updateArticle)
      .delete(adminHandler.deleteArticle);

  // STOP
  userRoutes
    .route('/login')
      .get(adminHandler.login)
      .post(adminHandler.autheticate(userSystem));

  adminRoutes
     .use('/blogUpdate', adminHandler.blogUpdate);

  adminRoutes
    .route('/contact')
      .get(adminHandler.contact)
      .post(adminHandler.editContact) 

  adminRoutes
    .get('/', adminHandler.home);

  userRoutes
   .use(setNavLinks)
   .get('/about', main.about)
   .get('/contact', main.contact)
   .get('/portfolio', main.portfolio)
   .get('/portfolio/:title', main.post)
   .get('/services', main.services)
   .get('/', main.home);

  security.use(function(req, res, done) {
    if(req.user) {
      console.log(req.user);
      done();
    } else {
      console.log('No tiene una sesion activa')
      res.redirect('/login');
    }
  });

   const admin = adminRoutes;
   const user = userRoutes;

   return { 
     admin, 
     user , 
     security, 
     fileUpload: adminHandler.handleFileUpload }
}

exports.fileUpload = adminHandler.handleFileUpload