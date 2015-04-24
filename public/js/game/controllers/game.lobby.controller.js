game.controller('LobbyController', function lobbyController($scope, $rootScope, $state){
	// console.log("Call from Card Service");
	
	$scope.createGame = function() {
		$rootScope.Game.actions.stepTwo();
		console.log(["Lobby Controller Says:", 'Complete Step 2'])
		$state.go('game.one');
	}
});