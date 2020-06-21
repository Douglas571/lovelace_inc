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
                },
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
mongoose.connect('mongodb://localhost/test', opts);
let db = mongoose.connection;
db.on('error',  console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('estamos listos-.-----------');
});

let Persona = require('./models/Persona.js');
Persona.find((err, personas) => {
    if(personas.lenght) return;

    console.log('dentro de persona')

    new Persona({
        nombre: 'Douglas',
        edad: 18,
        id: 29748656,
        ciudad: 'Cumarebo',
        trabaja: false
    }).save();

    new Persona({
        nombre: 'Alirio',
        edad: 56,
        id: 7490919,
        ciudad: 'Quebrada de Huten',
        trabaja: true
    }).save();

    new Persona({
        nombre: 'Yaquelin',
        edad: 48,
        id: 11479362,
        ciudad: 'Valencia',
        trabaja: true
    }).save();
});

// Middlewar configs
app.use(require('body-parser')());
app.use(express.static(__dirname + "/public"));         
app.use(vhost('admin.*', router.admin));
app.use(router.user);
app.use('/personas', function(req, res) {

    Persona.find({trabaja: true}, function(err, personas) {
        let context = {
            personas: personas.map((per) => {
                return {
                    nombre: per.nombre,
                    edad: per.edad,
                    id: per.id,
                    ciudad: per.ciudad
                };
            })
        };
        res.render('personas', context);
    });
});

//set up the server
app.set('port', process.env.PORT || 3000)
app.listen(app.get('port'), function(){
    console.log(`Lovelace is launched in: ` + 
                `http://localhost:${app.get('port')}`);
});