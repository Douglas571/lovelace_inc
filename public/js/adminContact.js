'use strict';
let button = document.querySelector('#submit');
let phone = document.querySelector('[name="phone"]');
let email = document.querySelector('[name="email"]');
let facebookUrl = document.querySelector('[name="facebookUrl"]');

button.addEventListener('click', el => {
	let newContactInfo = {
		phone: phone.value,
		email: email.value,
		facebookUrl: facebookUrl.value
	}

	console.log(JSON.stringify(newContactInfo));

	let res = fetch('/contact', 
		{
			method: 'POST',
			headers: {
				"accept": 'application/json',
				"content-type": 'application/json'}, 
			body: JSON.stringify(newContactInfo)
		}
	);

	res.then(res => res.text())
		.then(body => console.log('the request is: ' + JSON.parse(body).success));
});