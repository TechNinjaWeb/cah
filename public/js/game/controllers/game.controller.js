game.controller('GameController', function GameController($scope, GameData){
	// console.log("Call from Card Service");

	// Upon State Load, Send All Data
	GameData.run.emit('sendAll');

});