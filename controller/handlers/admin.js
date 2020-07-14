'use strict';

let { writeFile , readFileSync} = require('fs');
let BlogEntry = require("./../../models/blogEntry.js");

exports.home = function(req, res){
	res.send('Hello Admin!');
}

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

function getNewContactInfo(req){
	//TO-DO: Parse the contact info from request here.
	console.log(req.headers['content-type'] + ":");
	console.log(req.body);
	return req.body;
}
 
function setNewContactInfo(newContactInfo, callback){
	newContactInfo = JSON.stringify(newContactInfo);
	let content = readFileSync('./controller/handlers/contactInfo.json', 'utf-8');
	console.log('old content is: \n' + content);
	writeFile('./controller/handlers/contactInfo.json', newContactInfo, callback);

}

exports.contact = function(req, res){
	//TO-DO: Make a function to obtanin the info from data base that 
	//goes here

	switch(req.method){
		case 'GET':
			res.render('adminContact', { phone: '0412-162-65-58' });
			break;

		case 'POST':
			//TO-DO: Put function to edit contact info here.
			let newContactInfo = getNewContactInfo(req);
			setNewContactInfo(newContactInfo, (err) => {
				if(err) {
					console.warn(err);
					res.send({success: false});
				}

				let content = readFileSync('./controller/handlers/contactInfo.json', 'utf-8');
				console.log('new Content is: \n' + content);
				res.set("content-type", "application/json");
				res.send({success: true});
			});
			break;

		default:
			res.send(`Method: ${req.method} not alowed or available.`);
	}
}