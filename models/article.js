const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,

  cover: String,
  photo: [String],
  available: Boolean
});

module.exports = new mongoose.model('Article', articleSchema);