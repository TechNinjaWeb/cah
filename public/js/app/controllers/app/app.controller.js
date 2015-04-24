app.controller('AppController', function AppController($scope, UserSocket){
	$scope.test = "Testing From App Controller";

	UserSocket.forward('error');
	UserSocket.forward('server', $scope.server);

	// $scope.$on('socket:error', function (ev, data) { 
	// 	console.log(["Error Handing"], [ev, data]);
	// }

	// KEY LISTENERS
	$scope.$on('socket:server', function (ev, data) {
    	$scope.theData = data;
    	console.warn(['scope listner says', data.message], [ev, data]);
    });

    UserSocket.on('connect', function(){
    	console.log(["User Connected"]);
    })

    UserSocket.on('server', function(res){
    	console.log(["Server Says", res.message], [res]);
    })

    UserSocket.on('getAll', function(all){
    	console.log(["Gimme Gimme", all]);
    })

    UserSocket.on('getRooms', function(all){
    	console.log(["Gimme Rooms", all]);
    })

    UserSocket.on('getUsers', function(all){
    	console.log(["Gimme Users", all]);
    })

    // KEY FUNCTIONS
    $scope.sendAll = function() {
    	UserSocket.emit('sendAll', function(res){
	    	console.log(["Here's All the info I've got", res]);
	    })
    }

    $scope.sendRooms = function() {
    	UserSocket.emit('sendRooms', function(rooms){
	    	console.log(["Quick, Hide Here!", rooms]);
	    })
    }

    $scope.sendUsers = function() {
    	UserSocket.emit('sendUsers', function(users){
	    	console.log(["Quick, Hide Here!", users]);
	    })
    }

    
});