game.controller('GameNavController', function($scope, GameData, $rootScope, LoginService) {
    // console.log("Call from Card Service");
    var nav = {
        home: {
            name: 'home',
            sref: 'home.app',
            hash: '/'
        },
        lobby: {
            name: 'lobby',
            sref: 'game.lobby',
            hash: '/lobby'
        },
        player: {
            name: 'player',
            sref: 'game.player',
            hash: '/player'
        },
        czar: {
            name: 'czar',
            sref: 'game.czar',
            hash: '/czar'
        },
        options: {
            name: 'options',
            sref: 'game.options',
            hash: '/options'
        },
        login: {
            name: 'login',
            sref: 'home.login',
            hash: '/login'
        },
        create: {
            name: 'create',
            sref: 'home.create',
            hash: '/create'
        }
    }

    $scope.nav = nav;
    !!$rootScope.sessionUser ? $scope.sessionUser = true : $scope.sessionUser = false;

    
    $scope.login = function(username, password) {
        return LoginService.login(username, password);
    }

    $scope.logout = function() {
        return LoginService.logout();
    }
});