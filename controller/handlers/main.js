'use strict';

exports.home = function(req, res){
	res.render('main/home');
};

exports.services = function(req, res){
	res.render('main/services');
};

exports.portfolio = function(req, res){
	res.render('main/portfolio');
};

exports.contact = function(req, res){
	const contactInfo = require('./../../models/contactInfo.js');
	contactInfo.get()
		.then(context => {
			res.render('main/contact', context);
		});
};

exports.about = function(req, res){
	res.render('main/about');
}
