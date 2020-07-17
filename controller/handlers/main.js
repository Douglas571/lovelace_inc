'use strict';

const root = 'main/';
const patch = {
	home: 		root + 'home',
	services: 	root + 'services',
	portfolio: 	root + 'portfolio',
	contact: 	root + 'contact',
	about: 		root + 'about',
}

exports.home = function(req, res){
	res.render(patch.home);
};

exports.services = function(req, res){
	res.render(patch.services);
};

exports.portfolio = function(req, res){
	res.render(patch.portfolio);
};

exports.contact = async function(req, res){
	const contactInfo = require('./../../models/contactInfo.js');
	const context = await contactInfo.get();
	res.render(patch.contact, context);
};

exports.about = function(req, res){
	res.render(patch.about);
}
