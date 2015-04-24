app.controller('AppController', function AppController($scope, UserSocket){
	$scope.test = "Testing From App Controller";

    // Emite Get All Data On First Enter
    UserSocket.run.emit('sendAll');
    
});