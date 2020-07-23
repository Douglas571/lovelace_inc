'use strict';

const root = 'admin/';
const path = {
	home: 		root + 'home',
	contact: 	root + 'contact',
	blogUpdate: root + 'blog'

}

//because i'm happy, happy is the trut

function renderAdminView(res, path, context = {}){
	context.layout = 'main';
	context.admin = true;
	res.render(path, context);
}

exports.home = function(req, res){
	renderAdminView(res, path.home);	
}

exports.blogUpdate = function(req, res){
	const BlogEntry = require("./../../models/blogEntry.js");
	switch(req.method){
		case "GET":
			console.log("GET");
			console.log(req.url);
			res.render(path.blog);
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
	console.log('entra en contact');
	console.log(req.method);

	switch(req.method){
		case 'GET':
			let context = await contactInfo.get();
			renderAdminView(res, path.contact, context);
			break;

		case 'POST':
			let newContactInfo = req.body;

			console.log('constact post');
			console.log(newContactInfo);
			let result = await contactInfo.set(newContactInfo);
			res.set("content-type", "application/json");
			res.send(result);
			break;

		default:
			res.send(`Method: ${req.method} not alowed or available.`);
			break;
			
	}
}