let mongoose = require('mongoose');

let personaSchema = mongoose.Schema({
	nombre: String,
	edad: Number,
	id: Number,
	ciudad: String,
	trabaja: Boolean
});

personaSchema.methods.saludar = function(){
	return `¡Hola! me llamo ${nombre}, tengo ${edad} y nací en ${ciudad}`;
};

let Persona = mongoose.model('Persona', personaSchema);
module.exports = Persona;