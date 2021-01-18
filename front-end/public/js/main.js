const candidatos = [
	{
		id:1,
		nombre:'douglas',
		votos:2
	},
	{
		id:2,
		nombre:'Ana',
		votos:3
	},
	{
		id:3,
		nombre:'Maria',
		votos:4
	}
];



new Vue({
	el: '#app',
	data: {
		candidatos: candidatos
	},
	computed: {
		candidatosOrdenados() {
			return candidatos.sort((a, b) => b.votos - a.votos);
		}
	},
	methods: {
		votar(candidatoId){
			candidato = candidatos.find((candidato) => candidato.id == candidatoId);
			candidato.votos++;
		}
	}
});

console.log(candidatos[0].nombre);