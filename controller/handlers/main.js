'use strict';

exports.home = function(req, res){
	res.render('home');
};

exports.services = function(req, res){
	res.render('services');
};

exports.portfolio = function(req, res){
	res.render('portfolio');
};

exports.contact = function(req, res){
	const contactInfo = require('./../../models/contactInfo.js');
	let context = contactInfo.get();
	res.render('contact', context);
};

exports.about = function(req, res){
	res.render('about');
}
