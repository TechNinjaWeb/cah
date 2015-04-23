app.directive('levelOne', function() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: './js/app/html/level/one.html',
        link: function(scope, elem, attrs) {
            // console.log("ELEMENT PRESENT", attrs, elem);
            console.log("WORKING FROM GAME DIRECTIVE", elem);

            // Run Some Code Here For Your
            // Custom <game></game> Element

        }
    };
});