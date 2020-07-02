let BlogEntry = require("./../models/blogEntry.js");


'use strict'

exports.home = function(req, res){
	res.send('Hello Admin!');
};

exports.blogUpdate = function(req, res){
	switch(req.method){
		case "GET":
			console.log("GET");
			console.log(req.url);
			res.render('blogAdmin');
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