const { writeFile , readFile } = require('fs');
const path = {
	contactInfo: `${ __dirname }/contactInfo.json`,
}

exports.set = function( info ){
	return new Promise( resolve => {
		if ( typeof info !== String ) info = JSON.stringify( info );
		writeFile( path.contactInfo, info, ( err ) => {
			if ( err ) throw err;
			resolve( true );
		});
	});
}

exports.get = function(){
	return new Promise( resolve => {
		readFile( path.contactInfo, 'utf-8', ( err, text ) => {
			if( err ) throw err;
			resolve( JSON.parse( text ) );
		});
	});
}