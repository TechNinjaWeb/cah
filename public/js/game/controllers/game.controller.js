game.controller('GameController', function GameController($scope, UserSocket){
	// console.log("Call from Card Service");

	// Upon State Load, Send All Data
	UserSocket.run.emit('sendAll');

});