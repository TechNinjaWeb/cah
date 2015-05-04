game.controller('LobbyController', function lobbyController($scope, $rootScope, $state, GameData){
	// console.log("Call from Card Service");
	$scope.games={};
	$scope.games.list = window.GAMELIST = GameData.activeGames;
	$scope.games.players = $rootScope.Game.players;
	$scope.waiting = $rootScope.Game.waiting;
	
	GameData.run.emit('sendActiveGames');

	$scope.createGame = function() {
		console.log(["Lobby Controller Says:", 'Game Created']);

		GameData.createGame();
	    $state.go('game.lobby');
	}

	$scope.joinGame = function(id) {
		console.log(["Lobby Controller Says:", 'Joining Game', id])

		GameData.joinGame(id);
		$rootScope.Game.setVal('waiting', true);
		$rootScope.Game.waiting = true;
		
		setTimeout(function(){$state.reload();}, 200)
		$state.go('game.lobby');
	}

	$scope.quitGame = function() {
		console.log(["Lobby Controller Says:", 'Game Created']);

		GameData.quitGame();
		$rootScope.Game.setVal('waiting', false);
		$rootScope.Game.waiting = false;
		
		setTimeout(function(){$state.reload();}, 200)
	    $state.go('game.lobby');
	}
});