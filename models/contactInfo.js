const {writeFile , readFile} = require('fs');
const path = {
	contactInfo: `${__dirname}/contactInfo.json`,
}

exports.set = function(info){
	return new Promise(resolve, reject => {
		if (typeof info !== String) info = JSON.stringify(info);
		writeFile(path.contactInfo, info, (err) => {
			if (err) reject(err);
			resolve(true);
		});
	});
}

exports.get = function(){
	return new Promise(resolve, reject => {
		readFile(path.contactInfo, 'utf-8', (err, text) => {
			if(err)	reject(err);
			resolve(JSON.parse(text));
		});
	});
}