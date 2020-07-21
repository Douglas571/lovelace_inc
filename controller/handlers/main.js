'use strict';

const root = 'main/';
const path = {
	home: 		root + 'home',
	services: 	root + 'services',
	portfolio: 	root + 'portfolio',
	contact: 	root + 'contact',
	about: 		root + 'about',

	post: 		root + 'post',
}

exports.home = function(req, res){
	res.render(path.home);
};

exports.services = function(req, res){
	res.render(path.services);
};

const blogEntries = require('./../../models/blogEntry');
exports.portfolio = async function(req, res){	
	let entries = await blogEntries.find({});
	let context = {
		blogEntries: entries.map((entry) => {
			return {
				title: entry.title,
				author: entry.author,
				date: entry.date,
				description: (entry.description.slice(0, 45) + '...'),
				url: `/portfolio/${entry.title.replace(' ', '+')}`
			}
		}),
	};

	res.render(path.portfolio, context);
};

exports.post = async function(req, res){
	let title = req.params.title.replace('+', ' ');
	let blogEntry = await blogEntries.find({title: title});

	const context = blogEntry.map((entry) => {
		return {
			title: entry.title,
			autor: entry.autor,
			date: entry.date,
			content: entry.content,
		}
	});
	console.log(blogEntry);
	console.log(context);
	res.render(path.post, context);
};

exports.contact = async function(req, res){
	const contactInfo = require('./../../models/contactInfo.js');
	const context = await contactInfo.get();
	res.render(path.contact, context);
};

exports.about = function(req, res){
	res.render(path.about);
}

exports.blog = function(req, res) {
	let BlogEntry = require('./../../models/blogEntry.js');

    let context;
    BlogEntry.find( function(err, blogEntries){
        if(err)
            console.log("no hay entradas");
        
        context = {
            blogEntries: blogEntries.map((e) => {
                return {
                    title: e.title,
                    autor: e.autor,
                    date: e.date,
                    description: (e.description.slice(0, 45) + "...")
                };
            })
   	};

    	res.render('posts', context);    
	});
}