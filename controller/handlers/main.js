'use strict';
const { readFileSync } = require('fs');
const path = {
	contactInfo: './controller/handlers/contactInfo.json',
}


function getContactInformation(){
	//TO-DO: Search for the contact information in the data base or 
	//json file
	console.log('search in json file');


	/*
	//Asyncronous implementation.

	let contactPageInfo;
	readFile(path.contactInfo, 'utf-8', (error, text) => {
		if(error) throw error;
		console.log(`The file contain: \n ${text}`);
		contactPageInfo = JSON.parse(text);

	});
	*/
	let contactInfoString = readFileSync(path.contactInfo, 'utf-8');
	//TO-DO: implement readFileSync error handler.

	let contactPageInfo = JSON.parse(contactInfoString);

	console.log(contactPageInfo);
	return contactPageInfo;
}


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
	console.log('dispached request');
	let context = getContactInformation();
	console.log('render contact page');
	res.render('contact', context);
};

exports.about = function(req, res){
	res.render('about');
}
