let mongoose = require('mongoose');

let blogEntrySchema = new mongoose.Schema({
	//id: Number,
	date: String,
	title: String,
	autor: String,
	description: String,
	content: String
});

module.exports =  new mongoose.model("BlogEntry", blogEntrySchema);