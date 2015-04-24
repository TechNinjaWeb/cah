var app = angular.module('cah', [ 'ui.router'
	, 'cah.game'
	, 'btford.socket-io'
]);

app.controller('cah.controllers', []);
app.service('cah.services', []);

var game = angular.module('cah.game', ['btford.socket-io']);