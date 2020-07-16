'use strict';

function renderAdminView(res, path, context = {}){
	context.layout = null;
	res.render(path, context);
}

exports.home = function(req, res){
	renderAdminView(res, 'admin/home');	
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

exports.contact = async function(req, res){
	const contactInfo = require('../../models/contactInfo.js');

	switch(req.method){
		case 'GET':
			let context = await contactInfo.get();
			renderAdminView(res, 'admin/contact', context);
			break;

		case 'POST':
			let newContactInfo = req.body;
			let result = await contactInfo.set(newContactInfo);
			res.set("content-type", "application/json");
			res.send(result);
			break;

		default:
			res.send(`Method: ${req.method} not alowed or available.`);
			break;
			
	}
}