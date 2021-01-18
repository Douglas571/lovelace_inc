let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
	id: String,
	username: String,
  password: String,
  
	name: String,
	subname: String,
	role: String,
	created: Date
});

let User = mongoose.model('User', userSchema);
module.exports = User;