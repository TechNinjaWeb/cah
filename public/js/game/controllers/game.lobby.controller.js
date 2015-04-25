game.controller('LobbyController', function lobbyController($scope, $rootScope, $state, GameData){
	// console.log("Call from Card Service");
	$scope.data=[];
	
	$scope.createGame = function() {
		// $rootScope.Game.actions.stepTwo();
		console.log(["Lobby Controller Says:", 'Game Created'])
		GameData.run.emit('saveGame', {
	        state: 'waiting-for-players',
	        active: true,
	        waiting: true,
	        players: {
	            'MyName': 'MyName'
	        },
	        currentScore: [{'MyName': 0}],
	        specialOptions: {}
	    })
	    // Send To Game View
	    $state.go('game.one');
	}

});