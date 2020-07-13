var handlebars = require ('express-handlebars');

module.exports = handlebars.create({
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