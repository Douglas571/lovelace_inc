//TO-DO: Pass express to here.

const express = require('express');
const handlebarsWrapper = require('./handlebars.js');

function configViewEngine(app, dir){
	app.engine('hbs', handlebarsWrapper.engine);
	app.set('view engine', 'hbs')
	    .set('views', `${dir}/views`);
	
	return app;
}

module.exports = (name, dir) => {
	let app = express(name);

	app = configViewEngine(app, dir);

	app.use(require('body-parser')());
	app.use(express.static(`${dir}/public`));  

	return app;
}