game.directive('testCard', function() {
    return {
        restrict: 'A',
        transclude: true,
        // templateUrl: './js/app/html/element/game.hud.html',
        link: function(scope, elem, attrs) {
            // console.log("ELEMENT PRESENT", attrs, elem);
            console.log(["WORKING FROM LEVEL TWO TEST DIRECTIVE"], [elem, attrs, scope]);
            // Run Some Code Here For Your
            // Custom <game></game> Element
            scope.card = 'testing';
            scope.$apply();
        }
    };
});