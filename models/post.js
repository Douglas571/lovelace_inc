const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	title: String,
	date: String,
	author: String,
	summary: String,
	body: String,
	min: String
});

const Post = new mongoose.model('Post', postSchema);

module.export = Post;