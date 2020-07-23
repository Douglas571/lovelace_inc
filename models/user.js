let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
	authId: Number,
	username: String,
	name: String,
	subname: String,
	role: String,
	created: Date
});

let User = mongoose.model('User', userSchema);
module.exports = User;