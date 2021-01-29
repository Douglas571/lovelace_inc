const mongooseArticle = require('./../../models/article');

const Article = {
  urlOfCover: (article) => {
    let urlCover = ''

    urlCover = article
                .photos
                .find( photo => photo.id == article.cover )
                .url

    console.log(`the cover url is ${urlCover}`)
    return urlCover
  }
}

module.exports = Article