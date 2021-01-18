const _ = require('lodash');

function takeData(art) {
  const article = _.pick(art, ['name', 'price', 'stock', 'cover', 'available'])
  return article;
} exports.takeData = takeData; 

function hasData(art) {
  if(art) {
    return (art.name && art.price);  
  }
  
  return false;
} exports.hasData = hasData;

const Article = require('./../models/article');
exports.getArticles = async function() {
  let articles = await Article.find({});
  articles = articles
              .map(takeData)
              .filter(hasData);

  const context = {};
  context.articles  = articles;
  context.length = articles.length;

  return context;
}