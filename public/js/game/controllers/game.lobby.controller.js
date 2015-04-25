game.controller('LobbyController', function lobbyController($scope, $rootScope, $state, GameData){
	// console.log("Call from Card Service");
	$scope.data=[];
	GameData || {};
	$scope.createGame = function() {
		$rootScope.Game.actions.stepTwo();
		console.log(["Lobby Controller Says:", 'Complete Step 2'])
		$state.go('game.one');
	}

	$scope.makePost = window.makePost = function makePost(params) {
		console.log(["Lobby Controller Says", params]);
		var args = Array.prototype.splice.call(arguments, 0);
		for (prop in args[0]) if (!!args[0][prop]) return GameData.makePost(params).then(function(res){
			$scope.data.push({_id: res.id, username: params.username, gameData: params.gameData});
			console.log(["Lobby Controller Says", "Pushing Object To Server"], [{_id: res.id, username: params.username, gameData: params.gameData}]);
		}, function(err){
			console.log(["Lobby Controller Displeased"], [err]);
		});
			else console.log(["Post Response", params, res])
	}

	$scope.updatePost = function updatePost(index, username, gameData) {
		var args = Array.prototype.splice.call(arguments, 0),
			isClean = !args.some(function(e,i,a){ return e.length <= 0; });
		return !!isClean ? GameData.updatePost(index, username, gameData) : console.log("Please Enter Valid Args");
	}

	$scope.deletePost = window.deletePost = function deletePost(index) {
		return GameData.Resource.delete({id: $scope.data[index]._id}, function(res){ 
			GameData.data.splice(index, 1);
		});
	}

});