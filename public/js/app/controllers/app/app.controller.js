app.controller('AppController', function AppController($scope, GameData){
	$scope.test = "Testing From App Controller";

    // Emite Get All Data On First Enter
    GameData.run.emit('sendAll');
    
});