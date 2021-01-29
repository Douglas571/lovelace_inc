const _ = require('lodash');
function getArticles(search){
  search = search || {};
  try {
    let articles = await Article.find(search);
    articles.map( art => _.pick(
      [
        '__id',
        'name',
        'price',
        'stock',
        'cover',
        'photo'
      ]
    ));

  } catch (err) {
    throw err;

  }

  return articles;
}