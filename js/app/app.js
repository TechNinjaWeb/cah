var app = angular.module('cah', [ 'ui.router'
	, 'cah.services'
	, 'cah.controllers'	
]);

app.controllers = angular.module('cah.controllers', []);
app.services = angular.module('cah.services', []);