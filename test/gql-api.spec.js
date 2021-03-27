const fs = require('fs')
const path = require('path')

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const expect = chai.expect

const HOST = 'http://localhost:4000'
const QUERY_POINT = '/query'

async function fetchGql(body) {
  return await chai.request(HOST)
    .post('/query')
    .set('Content-Type','application/json')
    .set('Accept', 'application/json')
    .send(body)
}

describe('graphql API', async () => {

  function byPrice(a, b) {
      if (a.price > b.price) return 1
      if (a.price == b.price) return 0
      if (a.price < b.price) return -1
    }


  it('should return the array sorted', async () => {
    const numbers = [
      {
        price: 1
      },
      {
        price: 4
      },
      {
        price: 2
      }
    ]

    const expected = [
      {
        price: 1
      },
      {
        price: 2
      },
      {
        price: 4
      }
    ]

    expect(numbers.sort(byPrice)).to.be.deep.equal(expected)
  }) 

  it('Should return a greeting with the name', async () => {
    const name = 'Douglas'
    const dataExpected = {
      hello: `Hello ${name}! tanks you`
    }
    
    const res = await chai.request(HOST)
      .post(QUERY_POINT)
      .set('Content-Type','application/json')
      .set('Accept', 'application/json')
      .send({
        variables: {
          name
        },
        query: `mutation h($name: String){ hello(who: $name)}`
      })
    
    expect(res.body.data).to.deep.equal(dataExpected)
  })

  it('Should return the same article passed with a id filled', async () => {
    const article = {
      name: 'Calcetines',
      description: 'Calcetines de rayas azules y negras',
      price: 500,
      isAvailable: true,
      byRequest: true,
      stock: 10,
      photos: [
        {
          id: '12345',
          url: 'http://localhost:4000/12345.png'
        }
      ],
      cover: '12345'
    }

    const res = await chai.request(HOST)
      .post(QUERY_POINT)
      .set('Content-Type','application/json')
      .set('Accept', 'application/json')
      .send(
        {
          variables: {
            article
          },
          query: `mutation creatingArticle($article: ArticleInput) {
            createArticle(article: $article) {
              id
              name
              description
              price
              isAvailable
              byRequest
              stock
              photos {
                id
                url
              }
              cover
              urlOfCover
            }
          }`
        })

    const response = res.body

    if(response.errors) {
      console.log(response.errors)
      console.log(response.errors[0].locations)
    }

    expect(response).to.have.property('data')

    const resivedArticle = response.data.createArticle
    expect(resivedArticle.id).to.be.a('string')
    expect(resivedArticle).to.deep.include(article)

    expect(resivedArticle.urlOfCover).to.be.equal(article.photos[0].url)

  })

  it('Should return an array of one photo with id and url', async () => {
    const expectedData = [
      {
        id: '1000',
        url: 'http://localhost:4000/img/art/1000.jpeg'
      }
    ]

    const res = await chai.request(HOST)
      .post('/upload')
      .attach('photos', 
        fs.readFileSync(path.join(__dirname, 'resources/1000.jpeg')), '1000.jpeg')

    const data = res.body

    expect(data).to.be.deep.equal(expectedData)    

  })

  it('Should return an array of photos with url and id', async () => {
    const expectedData = [
      {
        id: '1000',
        url: 'http://localhost:4000/img/art/1000.jpeg'
      },
      {
        id: '2000',
        url: 'http://localhost:4000/img/art/2000.jpeg'
      }
    ]

    const res = await chai.request(HOST)
      .post('/upload')
      //.type('form')
      .attach('photos', 
        fs.readFileSync(path.join(__dirname, 'resources/1000.jpeg')), '1000.jpeg')
      .attach('photos', 
        fs.readFileSync(path.join(__dirname, 'resources/2000.jpeg')), '2000.jpeg')

    const data = res.body

    expect(data).to.be.deep.equal(expectedData)
  }) 


  async function sendArticle(article) {    
    const res = await fetchGql(
      {
        variables: {
          article
        },
        query: `mutation creatingArticle($article: ArticleInput) {
          createArticle(article: $article) {
            id
            name
            price
            isAvailable
            stock
          }
        }`
      }
    )

    return res.body.data.createArticle.id;
  }

  it('Should return an array of articles presaved', async () => {
    let articles = [
      {
        name: 'sandalias',
        price: 90,
        isAvailable: true,
        stock: 10
      },
      {
        name: 'calcetines',
        price: 100,
        isAvailable: true,
        stock: 10
      }
    ]
    articles = articles.sort(byPrice)
    await sendArticle(articles[0])
    await sendArticle(articles[1])

    const res = await chai.request(HOST)
      .post('/query')
      .set('Content-Type','application/json')
      .set('Accept', 'application/json')
      .send(
        {
          variables: {
            
          },
          query: `query getArticles {
            allArticles {
              id
              name
              price
              isAvailable
              stock
            }
          }`
        })
    const data = res.body.data

    const allArticles = data.allArticles.sort(byPrice)
    expect(allArticles).to.be.an('array')
    expect(allArticles[0]).to.deep.include(articles[0])
    expect(allArticles[1]).to.deep.include(articles[1])
  })

  it('Should return the updated article', async () => {
    const data = {
      name: 'Calcetines',
      description: 'Calcetines de rayas azules y negras',
      price: 500,
      isAvailable: true,
      byRequest: true,
      stock: 10,
      photos: [
        {
          id: '12345',
          url: '/12345.png'
        },
        {
          id: '78787',
          url: '/78787.png'
        }
      ],
      cover: '12345'
    }

    const articleId = await sendArticle(data)

    const expectedData = {
      id: articleId,
      name: 'Medias',
      description: 'Medias de rayas azules y negras',
      price: 200,
      isAvailable: true,
      byRequest: false,
      stock: 100,
      photos: [
        {
          id: '12345',
          url: '/12345.png'
        },
        {
          id: '39999',
          url: '/39999.jpeg'
        }
      ],
      cover: '39999'
    }

    await fetchGql(
      {
        variables: {
          article: expectedData
        },
        query: 
          `mutation updatingArticle($article: ArticleUpdateInput) {
            updateArticle(article: $article) {
              id
              name
              description
              price
              isAvailable
              byRequest
              stock
              photos {
                id
                url
              }
              cover
            }
          }`
      }
    )

    const res = await fetchGql({
      variables: {
        id: articleId
      },
      query: 
      `
        query findArticle($id: String) {
          article(id: $id) {
            id
            name
            description
            price
            isAvailable
            byRequest
            stock
            photos {
              id
              url
            }
            cover
          }
        }
      `
    })

    const result = res.body.data.article;
    //console.log(result)
    expect(result).to.deep.equal(expectedData)
  })
  
  it('Should delete the product that match the id passed', async () => {
    const data = {
      name: 'to delete',
      description: 'Calcetines de rayas azules y negras',
      price: 500,
      isAvailable: true,
      byRequest: true,
      stock: 10,
      photos: [
        {
          id: '12345',
          url: '/12345.png'
        }
      ],
      cover: '12345'
    }

    const articleId = await sendArticle(data)

    const deletedRes = await fetchGql({
      variables: {
        id: articleId
      },
      query: `
        mutation deletingArticle($id: String) {
          deleteArticle(id: $id) {
            id
            name
            description
            stock
          }
        }
      `
    })

    expect(deletedRes.body.data.deleteArticle.id).to.be.equal(articleId)
    expect(deletedRes.body.data.deleteArticle.name).to.be.equal(data.name)

    const queryRes = await fetchGql({
      variables: {
        id: articleId
      },
      query: 
      `
        query findingArticle($id: String) {
          article(id: $id) {
            id
          }
        }
      `
    })

    expect(queryRes.body.data.article).to.be.equal(null)

  })
  beforeEach((done) => {
    const MongoClient = require('mongodb').MongoClient;
      
    MongoClient.connect("mongodb://localhost/test", (err, client) => {
      if(err) {
        console.log(err)
        throw err
      } 

      const testDb = client.db('test')

      //testDb.collection('articles').insertOne({ class: 'someting' })
      testDb.collection('articles').deleteMany({})

      client.close()
      done()
    })
  })

})