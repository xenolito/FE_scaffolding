'use strict';

//block scoped "let" declaration
const sentences = [
	{ subject: 'Javascript', verb: 'is', adj: 'great' },
	{ subject: 'Dinosaurs', verb: 'are', adj: 'Gooone' }
];

//object destructuring
function say({ subject, verb, adj }) {
	console.log(`${subject} ${verb} ${adj}`);
}

for (let s of sentences) {
	say(s);
}

(function() {
	$(window).on('load', function() {
		console.log(`hola que ase jquery: ${$('.testing').attr('class')}`);
	});
})();
