const _ = require('lodash');

const formidable = require('formidable');
const pathUtil = require('path');
const fs = require('fs');
const { promisify } = require('util');

function takeData(art) {
  let article = _.pick(art, ['id', 'name', 'price', 'stock', 'photo', 'cover', 'available']);
  
  if(article.photos) {
    article.photos = article.photos.map( url => {
      const path = url.split('/');
      const name = path[path.length - 1];

      const isCover = (article.cover === name);

      return { url, name, isCover };
    });
  }
  console.log(article);
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

exports.searchArticle = async function(id) {
  let article = await Article.find({id});
  console.log(article);
  article = article
              .map(takeData)
              .filter(hasData);

 return article; 
}

exports.parseArticleFromRequest = async function(req, removeEmptyProperties){
  const form = formidable(
    { 
      multiples: true, 
      uploadDir: pathUtil.join(__dirname, './../../data'),
      keepExtensions: true
    }
  );
  form.parse(req, async (err, fields, files) => {
      console.log('fields: ' + JSON.stringify(fields));
      console.log('files: ' + JSON.stringify(files));

      let article = _.pick(fields, ['name', 'price', 'stock']);
      article.available = fields.available ? true : false;
      article.photo = [];
      article.cover = '';

      const rootFolder = pathUtil.join(__dirname, '..\\..\\front-end\\public');
      const imgFolder = rootFolder + '\\img';
      const artFolder = imgFolder + '\\art';
      const webArtFolder = '\\img\\art';

      if (hasPhotos(files)) {
        if (hasMoreThanOnePhoto(files)) {

          for(let photo of fils.photo) {
            await movePhoto(photo, artFolder);
            console.log('new path: ' + photo.path);
            photos.push(photo.path);
          }

        } else {
          await movePhoto(files.photo, artFolder)
          
          //files.photo.path = newPath;
          console.log('new path: ' + files.photo.path);
          article.photos.push(artFolder + files.photo.name);
        }

        article.cover = pathUtil(webArtFolder, fields.cover);
      }

      return article;
  });
}

function hasPhotos(files){
  return (files.photo);
}

function hasMoreThanOnePhoto(files){
  console.log('there ' + files.photo.length + 'photos');
  return (files.photo.length);
}

const rename = promisify(fs.rename);
async function movePhoto(file, newFolder) {
  console.log('moving...');
  const newPath = pathUtil.join(newFolder , file.name);
  await rename(file.path, newPath);
  file.path = newPath;
}

exports.login = function(req, res) {
  renderAdminView(res, 'admin/login');
}
