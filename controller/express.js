//TO-DO: Pass express to here.

const express = require('express');
const handlebarsWrapper = require('./handlebars.js');

function engineConfig(app){
	app.engine('hbs', handlebarsWrapper.engine);
	app.set('view engine', 'hbs')
	    .set('views', '../views');
	
	return app;
}

module.exports = (name) => {
	let app = express(name);

	app = engineConfig(app);
	app.use(require('body-parser')());

	console.log(__dirname);

	app.use(express.static('../public'));  

	return app;
}