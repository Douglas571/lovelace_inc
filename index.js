'use strict';

const http    = require('http');
const vhost   = require('vhost');

const router  = require('./controller/router.js');

//Wrapper configuration...
const handlebars = require('./controller/handlebars.js');
const mongoose = require('./controller/mongoose.js');
const express = require('./controller/express.js');

var app = express('Lovelace inc.');

// Middlewar configs       
app.use(vhost('admin.*', router.admin));
app.use(router.user);


let BlogEntry = require('./models/blogEntry.js');
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