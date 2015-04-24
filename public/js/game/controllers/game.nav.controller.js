GAME.controller('GameNavController', function($scope, UserSocket) {
    // console.log("Call from Card Service");
    $scope.sendAll = window.sendAll = function() {
    	console.log("Clicked SendAll");
    	UserSocket.emit('sendAll', function(res){
	    	console.log(["Here's All the info I've got", res]);
	    })
    }

    UserSocket.on('getAll', function(all){
    	console.log(["Gimme Gimme", all]);
    })
});