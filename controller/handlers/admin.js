'use strict';

const formidable = require('formidable');
const Article = require('./../../models/article.js');
const pathUtil = require('path');
const fs = require('fs');
const { promisify } = require('util');
const BlogEntry = require("./../../models/blogEntry.js");
const contactInfo = require('../../models/contactInfo.js');
const viewModelArticle = require('./../../viewModel/article.js');
const passport = require('passport');
const LocalStr = require('passport-local');

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
	console.log(req.user);
	renderAdminView(res, path.home);	
}

exports.blogUpdate = function(req, res){
	
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
				console.log("saved entry:");
				console.log(ent);
			});
			break;

		default:
			console.log("Metodo desconocido");
	}	
}


exports.contact = async function(req, res){
	console.log('entra en contact');
	let context = await contactInfo.get();
	renderAdminView(res, path.contact, context);
}

exports.editContact = async function(req, res){
	let newContactInfo = req.body;

	console.log('constact post');
	console.log(newContactInfo);
	let result = await contactInfo.set(newContactInfo);
	res.set("content-type", "application/json");
	res.send(result);
}

exports.newArticle = async function(req, res) {
	Article.find({}, (err, articles) => {
		if(err) throw err;

		articles = articles.map(viewModelArticle.takeData)
											 .filter(viewModelArticle.hasData);

		console.log(articles);

		const context = {};
		context.articles  = articles;
		context.length = articles.length;

		res.render('admin/article', context );
	})
}
function hasPhotos(files){
	return (files.photo);
}

function hasMoreThanOnePhoto(files){
	console.log('there ' + files.photo.length + 'photos');
	return (files.photo.length);
}

const rename = promisify(fs.rename);
async function movePhoto(file, newFolder) {
	console.log('moving...');
	const newPath = pathUtil.join(newFolder , file.name);
	await rename(file.path, newPath);
	file.path = newPath;
}

exports.createArticle = async function(req, res) {
  //instance formidable
	const form = formidable(
		{ 
			multiples: true, 
			uploadDir: pathUtil.join(__dirname, './../../data'),
			keepExtensions: true
		}
	);

	form.parse(req, async (err, fields, files) => {
		console.log('fields: ' + JSON.stringify(fields));
		console.log('files: ' + JSON.stringify(files));

		let photos = [];
		let coverPath;
    const available = fields.available ? true : false;

		const rootFolder = pathUtil.join(__dirname, '..\\..\\front-end\\public');
		const imgFolder = rootFolder + '\\img';
		const artFolder = imgFolder + '\\art';
		const webArtFolder = '\\img\\art';

		if (hasPhotos(files)) {
			if (hasMoreThanOnePhoto(files)) {
				let photo;
				for (let idx = 0; idx < files.photo.length; idx++) {
					photo = files.photo[idx];
					await movePhoto(photo, artFolder);

					//file.path = newPath;
					console.log('new path: ' + photo.path);
					photos.push(photo.path);
				}
			} else {
				await movePhoto(files.photo, artFolder)
				
				//files.photo.path = newPath;
				console.log('new path: ' + files.photo.path);
				photos.push(artFolder + files.photo.name);
			}

			coverPath = webArtFolder + '\\' + fields.cover;
		}
		

		let article = new Article(
			{
				name: fields.name,
				price: fields.price,
				stock: fields.stock,
        cover: coverPath,
				photo: photos,
				available
		});
		article = await article.save();
		console.log(`saved article: `);
		console.log(JSON.stringify(article));

		res.json({
			success: true,
			fields,
			article
		});

	})
}

exports.login = function(req, res) {
	renderAdminView(res, 'admin/login');
}

exports.autheticate = function(userSystem) {
	passport.use(new LocalStr(
		function(username, password, done) {
			try {
				const user = userSystem.authenticate({ username, password });
				console.log(user);
				done(null, user);

			} catch (err) {
				console.log(err.message);
				done(null, false, { message: err.message })
			}
		})
	)	

	passport.serializeUser(function(user, done) {
	  done(null, user.username);
	});

	passport.deserializeUser(function(id, done) {
	  done(null, userSystem.user);
	});

	return passport.authenticate('local', 
			{ 
				successRedirect: 'admin/',
	      failureRedirect: './login',
	      //failureFlash: true 
	    }
	  )
}

exports.setArticleAvailable = async function(req, res){
	const articleId = req.body.id;
	const articleAvailable = req.body.available;
	Article.findOne({ __id: articleId }, (err, art) => {
		console.log('Available to modifie: ' + JSON.parse(JSON.stringify(art)));
		art.available = articleAvailable;
		art.save((err, art) => {
			console.log('Available modified: ' + JSON.parse(JSON.stringify(art)));

			res.json(viewModelArticle.takeData(art));
		})
	});


}