const { writeFile , readFileSync} = require('fs');
const path = {
	contactInfo: `${__dirname}/contactInfo.json`,
}

exports.set = function(info, callback){
	info = JSON.stringify(info);
	writeFile(path.contactInfo, info, callback);
}

exports.get = function(){
	let contactInfoString = readFileSync(path.contactInfo, 'utf-8');
	//TO-DO: implement readFileSync error handler.

	let contactInfo = JSON.parse(contactInfoString);
	return contactInfo;
}