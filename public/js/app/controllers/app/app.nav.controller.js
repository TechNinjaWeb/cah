app.controller('NavController', function navController($scope) {
    // console.log("Call from Card Service");

    var nav = {
        home: {
            name: 'home',
            sref: 'home.app',
            hash: '/'
        },
        steps: {
            name: 'steps',
            sref: 'home.steps',
            hash: '/steps'
        }
    }

    $scope.nav = nav;
});