'use strict';

/*
	TO-DO: Thought in a way to reduce the duplicate name
	for every route.
*/

const root = 'main/';
const patch = {
	home: 		root + 'home',
	services: 	root + 'services',
	proyects: 	root + 'proyects',
	contact: 	root + 'contact',
	about: 		root + 'about',
}

exports.home = function(req, res){
	res.render(patch.home);
};

exports.services = function(req, res){
	res.render(patch.services);
};

exports.proyects = function(req, res){
	res.render(patch.proyects);
};

exports.contact = async function(req, res){
	const contactInfo = require('./../../models/contactInfo.js');
	const context = await contactInfo.get();
	res.render(patch.contact, context);
};

exports.about = function(req, res){
	res.render(patch.about);
}
