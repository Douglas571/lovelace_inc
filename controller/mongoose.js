//TO-DO: put mongoose config here.
const mongoose = require('mongoose');
const opts = {
                server: {
                    socketOptions: {
                        keepAlive: 1
                    }
                },
                useNewUrlParser: true,
                useUnifiedTopology: true
            };
mongoose.connect('mongodb://localhost/test', opts);

let BlogEntry = require('../models/blogEntry.js');
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

module.exports = mongoose;