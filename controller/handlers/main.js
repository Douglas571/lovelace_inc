'use strict'

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
	res.render('contact');
};

exports.about = function(req, res){
	res.render('about');
}
