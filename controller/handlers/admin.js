'use strict';

exports.home = function(req, res){
	res.send('Hello Admin!');
}

exports.blogUpdate = function(req, res){
	const BlogEntry = require("./../../models/blogEntry.js");
	switch(req.method){
		case "GET":
			console.log("GET");
			console.log(req.url);
			res.render('admin/blog');
			break;

		case "POST":
			console.log("POST - Entrada al blog");
			console.log(req.url);
			console.log(req.body);

			new BlogEntry({
				title: req.body.title,
				autor: req.body.autor,
				date: req.body.date,
				description: req.body.description,
			}).save((err, ent)=>{
				console.log("save entry:");
				console.log(ent);
			});
			break;

		default:
			console.log("Metodo desconocido");
	}	
}

exports.contact = function(req, res){
	const contactInfo = require('../../models/contactInfo.js');

	switch(req.method){
		case 'GET':
			contactInfo.get()
				.then(context => {
					res.render('admin/contact', context);		
				});
			break;

		case 'POST':
			let newContactInfo = req.body;
			contactInfo.set(newContactInfo)
				.then( value => {
					res.set("content-type", "application/json");
					res.send({success: value});
				});
			break;

		default:
			res.send(`Method: ${req.method} not alowed or available.`);
			break;
			
	}
}