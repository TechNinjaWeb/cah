game.controller('LobbyController', function lobbyController($scope, $rootScope, $state, GameData){
	// console.log("Call from Card Service");
	$scope.games={};
	$scope.games.list = window.GAMELIST = GameData.data;
	$scope.games.players = GameData.players;
	
	GameData.run.emit('sendActiveGames')

	$scope.createGame = function() {
		// $rootScope.Game.actions.stepTwo();
		console.log(["Lobby Controller Says:", 'Game Created'])
		GameData.createGame();
	    $state.go('game.lobby');
	}


	$scope.joinGame = function(id) {
		console.log(["Lobby Controller Says:", 'Joining Game', id])

		GameData.joinGame(id);
		$state.go('game.one');
	}

	// socket.run.on('gameState', function(game){
 //        console.log(["Updating Game Data", game]);
 //        console.warn(["REMOVING OLD DATA", 'PRE'], [socket.data])
        
 //        socket.data.shift();
 //        console.warn(["REMOVING OLD DATA", 'POST'], [socket.data])
 //        socket.data.push(game);

 //        $rootScope.$apply();
 //    })
});