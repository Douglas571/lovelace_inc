const mongooseArticle = require('./../../models/article');

module.exports = {
  createArticle: async (_, { article }) => {
    console.log('crating article...')
    article.id = article.id || Date.now()
    
    const newArticle = await mongooseArticle.create(article)

    console.log(JSON.stringify(newArticle))

    return newArticle
  },

  updateArticle: async (_, { article }) => {
    
    const result = await mongooseArticle.updateOne({ id: article.id }, { $set: article })
    const articleToReturn = await mongooseArticle.findOne({ id: article.id })

    return articleToReturn
  },

  addPhotosToArticle: async (_, { id, photos }) => {
    await mongooseArticle.update(
      { id }, 
      { 
        $set: { 
          photo: photos.map( ({ url }) => url )
        }
      })
    return await mongooseArticle.findOne({ id })
  },
  hello: async (_, { who }) => {
    console.log('graphql: hello msethod')
    return `Hello ${who || 'World'}! tanks you`
  }
}