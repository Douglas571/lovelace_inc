const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  id: String,
  url: String
})

const articleSchema = new mongoose.Schema({
  id: String,

  name: String,
  description: String,
  price: Number,
  stock: Number,

  cover: String,
  photos: [photoSchema],
  /*
    photo: [{ id: string, url: string}]

  */
  isAvailable: Boolean,
  byRequest: Boolean

});

module.exports = new mongoose.model('Article', articleSchema);