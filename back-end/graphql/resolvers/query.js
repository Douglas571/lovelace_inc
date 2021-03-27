const mongooseArticle = require('./../../models/article');

const Query = {
  article: async (_, { id }, contex) => {
    const article = await mongooseArticle.findOne({ id })
    return article
  },
  allArticles: async () => {
    return await mongooseArticle.find({})
  }
}

module.exports = Query