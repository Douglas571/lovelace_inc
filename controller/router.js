'use strict';
let admin = require('./handlers/admin.js');
let main = require('./handlers/main.js');

let userRoutes = require('express').Router();
let adminRouts = require('express').Router();

userRoutes
   .get('/about', main.about)
   .get('/contact', main.contact)
   .get('/portfolio', main.portfolio)
   .get('/portfolio/:title', main.post)
   .get('/services', main.services)
   .get('/', main.home);

adminRouts
   .get('/', admin.home)
   .use('/contact', admin.contact)
   .use('/blogUpdate', admin.blogUpdate);

exports.user = userRoutes;
exports.admin = adminRouts;