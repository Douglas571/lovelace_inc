const mongooseArticle = require('./../../models/article');

const Query = {
  article: async (_, { id }, contex) => {
    return await mongooseArticle.findOne({ id })
  },
  allArticles: async () => {
    return await mongooseArticle.find({})
  }
}

module.exports = Query