app.directive('hud', function() {
    return {
        restrict: 'A',
        transclude: true,
        templateUrl: './js/app/html/element/game.hud.html',
        link: function(scope, elem, attrs) {
            // console.log("ELEMENT PRESENT", attrs, elem);
            console.log("WORKING FROM HUD DIRECTIVE", elem);

            // Run Some Code Here For Your
            // Custom <game></game> Element

        }
    };
});