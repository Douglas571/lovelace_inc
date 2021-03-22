const { graphqlHTTP } = require('express-graphql')
const { makeExecutableSchema } = require('@graphql-tools/schema')

class Article {
  constructor (id) {
    this.id = id
    this.name = 'un articulo'
    this.price = 10
    this.stock = 20
    this.photo = [
      {
        url: 'some url',
        name: 'some name'
      }
    ]
    this.cover = `${this.photo.cover} for cover`
    this.available = true
  }
}
 
const typeDefs = require('./type-defs')
const resolvers = require('./resolvers')
const schema = makeExecutableSchema({ typeDefs, resolvers })

module.exports = graphqlHTTP(({ user, body }) => {
  console.log(body);
  return {
    schema,
    context: {
      user,
      body
    }
  }
})

// express-graphql always read this data fron req.body
  // query
  // variables
  // operationName
  // raw