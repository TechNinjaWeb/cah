// TECH NINJA SETTINGS
// Parse.initialize("WB1IfdqCe1sBMBolX4B3EwiVho5331oCZbg9HHcT", "a3eTy2czPCmegTJ3iv2o9E0iv4uj82GHx1Ah5vmp");

// ALPHANERD SETTINGS
Parse.initialize("qMpbJ7CGg4grTxWXnxYPJy0kgY7jUZUP6W3dkuBQ", "m5DNTkV6F75qHihs8zoInXs3UKZbN4Uehe1twAW3");

var app = angular.module('cah', [ 'ui.router'
	, 'cah.game'
	, 'btford.socket-io'
]);

app.controller('cah.controllers', []);
app.service('cah.services', []);