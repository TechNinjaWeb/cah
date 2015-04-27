game.controller('LobbyController', function lobbyController($scope, $rootScope, $state, GameData){
	// console.log("Call from Card Service");
	$scope.games={};
	$scope.games.list = window.GAMELIST = GameData.data;
	$scope.games.players = $rootScope.Game.players;
	$scope.waiting = window.waiting = false;

	window.techninja.actions.stateReload = function() {
		console.log(["Lobby Controller Says:", 'State Reloaded'])
		$state.reload();
	}
	
	GameData.run.emit('sendActiveGames');

	$scope.createGame = function() {
		// $rootScope.Game.actions.stepTwo();
		console.log(["Lobby Controller Says:", 'Game Created'])
		GameData.createGame();
	    $state.go('game.lobby');
	}


	$scope.joinGame = function(id) {
		console.log(["Lobby Controller Says:", 'Joining Game', id])

		GameData.joinGame(id);
		$scope.waiting = true;
		$state.go('game.lobby');
	}

});