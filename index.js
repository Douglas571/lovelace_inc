'use strict';

const http    = require('http');
const express = require('express');
const vhost   = require('vhost');

const router  = require('./controller/router.js');
const handlebars = require('./controller/handlebars.js');


var app = express('Lovelace inc.');

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
                },
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
mongoose.connect('mongodb://localhost/test', opts);
let db = mongoose.connection;
db.on('error',  console.error.bind(console, 'connection error:'));

let BlogEntry = require('./models/blogEntry.js');
BlogEntry.find((err, blogEntries) => {
    if(blogEntries === []){
        let entries = [];
    
        entries[0] = new BlogEntry({
            date: "10-06-2020",
            title: "Fist entry",
            autor: "@DouglasSocorro",
            description: "This is my first post of my personal Blog 'Lovelace inc'"
        });

        entries[1] = new BlogEntry({
            date: "15-06-2020",
            title: "Second entry",
            autor: "@DouglasSocorro",
            description: "this is my second entry of my personal blog :/"
        });

        entries[2] = new BlogEntry({
            date: "20-06-2020",
            title: "thirth entry",
            autor: "@DouglasSocorro",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        });

        entries.forEach(function(ent){
            ent.save((err, ent) => console.log(ent));
        });
    } else {
        console.log("hay entradas");
        return;
    }
});

// Middlewar configs
app.use(require('body-parser')());
app.use(express.static(__dirname + "/public"));         
app.use(vhost('admin.*', router.admin));
app.use(router.user);

app.use('/blog/all', function(req, res) {
    let context;
    BlogEntry.find( function(err, blogEntries){
        if(err)
            console.log("no hay entradas");
        
        context = {
            blogEntries: blogEntries.map((e) => {
                return {
                    title: e.title,
                    autor: e.autor,
                    date: e.date,
                    description: (e.description.slice(0, 45) + "...")
                };
            })
        };

        console.log("----------- encontrados -----------");
        blogEntries.forEach(function(ent){
            console.log(`${ent.date} : ${ent.title} - ${ent.autor}
                ${ent.description}`);
        });

        console.log("----------- Contexto -----------");
        console.log(context);

        res.render('posts', context);    
    });
});

//set up the server
app.set('port', process.env.PORT || 3000);

switch(app.get('env')){
	case "production":
		console.log('Production');
		break;
	case "development":
		console.log('Development');
		break;
	default:
		console.log('Unknow enviroment');
}

http.createServer(app).listen(app.get('port'), function(){
		console.log('Lovelace is in "' + app.get('env') + 
					'" mode and launched in: http://localhost:' + app.get('port') +
					'; press Contrl + C to continue.');
	});