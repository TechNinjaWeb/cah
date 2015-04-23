app.config(function config($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider) {
    $stateProvider
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
        .state('home.lobby', {
            url: '/',
            views: {
                'content@': {
                	templateUrl: './js/app/html/pages/home.html',
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
            url: '',
            abstract: true,
            views: {
                'nav@': {
                    templateUrl: './js/app/html/template/game.nav.html',
                    controller: ""
                },
                'content@': {
                    templateUrl: './js/app/html/template/game.lobby.html',
                    controller: ""
                },
                'left@': {
                    templateUrl: './js/app/html/template/game.left.sidebar.html',
                    controller: ""
                },
                'right@': {
                    templateUrl: './js/app/html/template/game.right.sidebar.html',
                    controller: ""
                },
                'footer@': {
                    templateUrl: './js/app/html/template/app.footer.html',
                    controller: ""
                }
            }
        })
        .state('game.lobby', {
            url: '/game',
            views: {
                'game': {
                    templateUrl: './js/app/html/test/test.html',
                    controller: ""
                }
            }
        })
        .state('game.one', {
            url: '/level-one',
            views: {
                'game': {
                    templateUrl: './js/app/html/test/game.test.html',
                    controller: ""
                }
            }
        })
        .state('home.test', {
            url: '/testing',
            views: {
                'content@': {
                	template: 'test placeholder',
                    controller: ""
                }
            }
        });
        $urlRouterProvider.otherwise('/');
        // $locationProvider.html5Mode(true);
});