app.config(function config($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider) {
    $stateProvider
////    App Routing     ////
        .state('home', {
            url: '',
            abstract: true,
            views: {
                'nav@': {
                    templateUrl: "./js/app/html/template/app.nav.html",
                    controller: 'NavController'
                },
                'footer@': {
                    templateUrl: "./js/app/html/template/app.footer.html",
                    controller: 'NavController'
                }
            }
        })
        .state('home.app', {
            url: '/',
            views: {
                'content@': {
                    templateUrl: './js/app/html/pages/home.html',
                    controller: "AppController"
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
////    Game Routing        ////
        .state('game', {
            url: '/game',
            abstract: true,
            views: {
                'nav@': {
                    templateUrl: './js/game/html/template/game.nav.html',
                    controller: "GameNavController"
                },
                'content@': {
                    templateUrl: './js/game/html/template/game.lobby.content.html',
                    controller: "GameController"
                },
                'left@': {
                    templateUrl: './js/game/html/template/game.left.sidebar.html',
                    controller: ""
                },
                'right@': {
                    templateUrl: './js/game/html/template/game.right.sidebar.html',
                    controller: ""
                },
                'footer@': {
                    templateUrl: './js/app/html/template/app.footer.html',
                    controller: ""
                }
            }
        })
        .state('game.lobby', {
            url: '/lobby',
            views: {
                'game': {
                    templateUrl: './js/game/html/pages/lobby.html',
                    controller: "LobbyController"
                },
                'sandbox': {
                    template: 'testing the sandbox ui tag'
                }
            }
        })
        .state('game.join', {
            url: '/join',
            views: {
                'game': {
                    templateUrl: './js/game/html/pages/join.game.html',
                    controller: "LobbyController"
                },
                'sandbox': {
                    template: 'testing the sandbox ui tag'
                }
            }
        })
        .state('game.create', {
            url: '/create',
            views: {
                'game': {
                    templateUrl: './js/game/html/pages/create.game.html',
                    controller: "LobbyController"
                },
                'sandbox': {
                    template: 'testing the sandbox ui tag'
                }
            }
        })
        .state('game.options', {
            url: '/options',
            views: {
                'game': {
                    templateUrl: './js/game/html/pages/options.html',
                    controller: ""
                },
                'sandbox': {
                    template: 'testing the sandbox ui tag'
                }
            }
        })
        .state('game.one', {
            url: '/level-one',
            views: {
                'game': {
                    templateUrl: './js/game/html/level/one.html',
                    controller: ""
                }
            }
        })
        .state('game.two', {
            url: '/level-two',
            views: {
                'game': {
                    templateUrl: './js/game/html/level/two.html',
                    controller: ""
                }
            }
        })
////    Test Routing        ////
        .state('home.test', {
            url: '/testing',
            views: {
                'content@': {
                    templateUrl: './js/app/html/test/test.html',
                    controller: ""
                }
            }
        });
        $urlRouterProvider.otherwise('/');
        // $locationProvider.html5Mode(true);
});