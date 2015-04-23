app.config(function config($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider) {
    $stateProvider
        .state('home', {
            url: '',
            abstract: true,
            views: {
                'nav': {
                    templateUrl: "./js/app/html/template/app.nav.html",
                    controller: 'NavController'
                },
                'footer': {
                    templateUrl: "./js/app/html/test/test.html",
                    controller: 'NavController'
                }
            }
        })
        .state('home.lobby', {
            url: '/',
            views: {
                'content': {
                	templateUrl: './js/app/html/pages/lobby.html',
                    controller: "LobbyController"
                }
            }
        })
        .state('home.steps', {
            url: '/steps',
            views: {
                'content@': {
                	templateUrl: './js/app/html/pages/steps.html',
                    controller: ""
                }
            }
        })
        .state('game', {
            url: '/game',
            abstract: true,
            views: {
                'content': {
                	templateUrl: './js/app/html/template/game.output.html',
                    controller: ""
                }
            }
        })
        .state('game.output', {
            url: '',
            views: {
                'game': {
                	templateUrl: './js/app/html/test/test.html',
                    controller: ""
                }
            }
        });
        $urlRouterProvider.otherwise('/');
        // $locationProvider.html5Mode(true);
});