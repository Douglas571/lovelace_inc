'use strict';

var express = require('express');
var vhost   = require('vhost');
var router  = require('./router.js');

var handlebars = require ('express-handlebars');
handlebars = handlebars.create({
                    defaultLayout: 'main',
                    extname: '.hbs',
                    helpers: {
                        section: function(name, options) {
                            if(!this._sections) this._sections = {};
                            this._sections[name] = options.fn(this);
                            return null;
                        }
                    }
                });

var app = express();

//Engine configs
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs')
    .set('views', `${__dirname}/views`);

//Data base configs

let mongoose = require('mongoose');
let opts = {
                server: {
                    socketOptions: {
                        keepAlive: 1
                    }
                }
            }
mongoose.connect('mongodb://localhost/test', opts);
let db = mongoose.connection;


// Middlewar configs
app.use(require('body-parser')());
app.use(express.static(__dirname + "/public"));         
app.use(vhost('admin.*', router.admin));
app.use(router.user);

//set up the server
app.set('port', process.env.PORT || 3000)
app.listen(app.get('port'), function(){
    console.log(`Lovelace is launched in: ` + 
                `http://localhost:${app.get('port')}`);
});