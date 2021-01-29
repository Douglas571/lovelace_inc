const formidable = require('formidable')
const Article = require('./../../../models/article.js')
const pathUtil = require('path')
const fs = require('fs')
const { promisify } = require('util')

exports.upload = async function (req, res, next) {
  console.log('get here... file upload')
  const form = formidable(
    {
      multiples: true,
      uploadDir: pathUtil.join(__dirname, './../../../../data/temp'),
      keepExtensions: true
    }
  )

  form.parse(req, async (err, fields, files) => {
    console.log('fields: ' + JSON.stringify(fields))
    console.log('files: ' + JSON.stringify(files))

    const listOfPhotos = await processFileUpload(files)
    console.log(listOfPhotos)

    res.set('Access-Control-Allow-Origin', '*')
    res.json(listOfPhotos)


    /*
    text {
      id: Math.floor(Math.random() * Date.now())
      name:
      price:
      available:
      stock:
      cover:
    }

    photos: [{
      id:
      url:
    }]

      extraer el id del archivo y la url

    */
  })
}

async function processFileUpload({ photos }) {
  const rootFolder = pathUtil.join(__dirname, '../../../../front-end/public')
  const imgFolder = rootFolder + '/img'
  const artFolder = imgFolder + '/art'
  const webArtFolder = '/img/art'

  const listOfPhotos = []

  if (photos) {
    if (photos.length > 1) {

      for(let photo of photos) {
        await movePhoto(photo, artFolder)

        listOfPhotos.push({
          id: photo.name.split('.')[0],
          url: webArtFolder + '/' + photo.name
        })
      }
    } else {
      await movePhoto(photos, artFolder)

      listOfPhotos.push({
        id: photos.name.split('.')[0],
        url: webArtFolder + '/' + photos.name 
        //not use path.join for not transform '/' in '\\'
      })
    }
  } 

  return listOfPhotos
}

function hasMutipleFiles(files) {
  
}

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