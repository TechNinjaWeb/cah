game.directive('levelOne', function() {

    console.log("From Level One");
    return {
        restrict: 'A',
        controller: 'LevelOneController',
        transclude: true,
        link: function(scope, elem, attrs, LevelOneController) {
        
        }
    }

});