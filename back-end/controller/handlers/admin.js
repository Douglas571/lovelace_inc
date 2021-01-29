'use strict'

const articlesHandler = require('./admin/articles-handler')

const formidable = require('formidable')
const Article = require('./../../models/article.js')
const pathUtil = require('path')
const fs = require('fs')
const { promisify } = require('util')
const BlogEntry = require('./../../models/blogEntry.js')
const contactInfo = require('../../models/contactInfo.js')
const viewModelArticle = require('./../../viewModel/article-view-model.js')
const passport = require('passport')
const LocalStr = require('passport-local')

const root = 'admin/'
const path = {
  home: root + 'home',
  contact: root + 'contact',
  blogUpdate: root + 'blog'
}

// because i'm happy, happy is the trut

function renderAdminView (res, path, context = {}) {
  context.layout = 'main'
  context.admin = true
  res.render(path, context)
}

exports.home = function (req, res) {
  console.log(req.user)
  renderAdminView(res, path.home)
}

exports.blogUpdate = function (req, res) {
  switch (req.method) {
    case 'GET':
      console.log('GET')
      console.log(req.url)
      res.render(path.blog)
      break

    case 'POST':
      console.log('POST - Entrada al blog')
      console.log(req.url)
      console.log(req.body)

      new BlogEntry({
        title: req.body.title,
        autor: req.body.autor,
        date: req.body.date,
        description: req.body.description
      }).save((err, ent) => {
      	if (err) throw err
        console.log('saved entry:')
        console.log(ent)
      })
      break

    default:
      console.log('Metodo desconocido')
  }
}

exports.contact = async function (req, res) {
  console.log('entra en contact')
  const context = await contactInfo.get()
  renderAdminView(res, path.contact, context)
}

exports.editContact = async function (req, res) {
  const newContactInfo = req.body

  console.log('constact post')
  console.log(newContactInfo)
  const result = await contactInfo.set(newContactInfo)
  res.set('content-type', 'application/json')
  res.send(result)
}

exports.login = function (req, res) {
  renderAdminView(res, 'admin/login')
}

exports.autheticate = function (userSystem) {
  passport.use(new LocalStr(
    function (username, password, done) {
      try {
        const user = userSystem.authenticate({ username, password })
        console.log(user)
        done(null, user)
      } catch (err) {
        console.log(err.message)
        done(null, false, { message: err.message })
      }
    })
  )

  passport.serializeUser(function (user, done) {
	  done(null, user.username)
  })

  passport.deserializeUser(function (id, done) {
	  done(null, userSystem.user)
  })

  return passport.authenticate('local',
    {
      successRedirect: 'admin/',
	      failureRedirect: './login'
	      // failureFlash: true
	    }
	  )
}

exports.setArticleAvailable = async function (req, res) {
  const articleId = req.body.id
  const articleAvailable = req.body.available
  Article.findOne({ __id: articleId }, (err, art) => {
    console.log('Available to modifie: ' + JSON.parse(JSON.stringify(art)))
    art.available = articleAvailable
    art.save((err, art) => {
      console.log('Available modified: ' + JSON.parse(JSON.stringify(art)))

      res.json(viewModelArticle.takeData(art))
    })
  })
}

// Articles Methods
exports.viewAllArticles = async function (req, res) {
  console.log('finding articles....')
  Article.find({}, (err, articles) => {
    if (err) throw err

    if(articles) {
      articles = articles
      .map(viewModelArticle.takeData)
      .filter(viewModelArticle.hasData)

    } else {
      articles = []
    }

    const context = {}
    context.articles = articles.reverse()
    context.length = articles.length

    res.render('admin/article', context)
  })
}

exports.handleFileUpload = articlesHandler.upload

exports.createArticle = async function (req, res) {
  console.log('GET HERE ARTICLE CREATNG...')
  // instance formidable
  const form = formidable(
    {
      multiples: true,
      uploadDir: pathUtil.join(__dirname, './../../../data'),
      keepExtensions: true
    }
  )

  form.parse(req, async (err, fields, files) => {
    console.log('fields: ' + JSON.stringify(fields))
    console.log('files: ' + JSON.stringify(files))



    const photos = []
    let coverPath
    const available = !!fields.available

    const rootFolder = pathUtil.join(__dirname, '..\\..\\..\\front-end\\public')
    const imgFolder = rootFolder + '\\img'
    const artFolder = imgFolder + '\\art'
    const webArtFolder = '\\img\\art'

    if (hasPhotos(files)) {
      if (hasMoreThanOnePhoto(files)) {
        let photo
        for (let idx = 0; idx < files.photo.length; idx++) {
          photo = files.photo[idx]
          await movePhoto(photo, artFolder)

          console.log('new path: ' + photo.path)
          photos.push(pathUtil.join(webArtFolder, photo.name))
        }
      } else {
        await movePhoto(files.photo, artFolder)

        console.log('new path: ' + files.photo.path)
        photos.push(pathUtil.join(webArtFolder, files.photo.name))
      }

      coverPath = webArtFolder + '\\' + fields.cover
    }

    let article = new Article(
      {
        id: Date.now(),
        name: fields.name,
        price: fields.price,
        stock: fields.stock,
        cover: coverPath,
        photo: photos,
        available
      })

    article = await article.save()
    console.log('saved article: ')
    console.log(JSON.stringify(article))

    res.redirect('/admin/articulo')

    /*
		res.json({
			success: true,
			fields,
			article
		});
	*/
  })
}

exports.viewArticle = async function (req, res) {
  const context = {}
  const id = req.params.id
  console.log('The article to show is:' + id)

  const article = await viewModelArticle.searchArticle(id)
  context.article = article[0]

  switch (req.headers.accept.split(',')[0].split('/')[1]) {
    case 'html':
      console.log('send html')
      renderAdminView(res, 'admin/sart', context)
      break
    case 'json':
      res.json(article)
      break
  }
}
exports.updateArticle = async function (req, res) {
  let dataToUpdate = await viewModelArticle.parseArticleFromRequest(req, true)
  const id = req.params.id

  dataToUpdate = removeEmptyProperties(dataToUpdate)

  const filter = { id }
  const update = { $set: dataToUpdate }

  console.log(dataToUpdate)
  res.json({ filter, update })

// const numberOfUpdates = await Article.update(filter, update);
}
exports.deleteArticle = async function (req, res) {}

// Utilities
function hasPhotos (files) {
  return (files.photo)
}

function hasMoreThanOnePhoto (files) {
  console.log('there ' + files.photo.length + 'photos')
  return (files.photo.length)
}

const rename = promisify(fs.rename)
async function movePhoto (file, newFolder) {
  console.log('moving...')
  const newPath = pathUtil.join(newFolder, file.name)
  await rename(file.path, newPath)
  file.path = newPath
}

function removeEmptyProperties (data) {

}
