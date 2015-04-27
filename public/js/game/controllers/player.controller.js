game.controller('LevelOneController', ['$scope', '$rootScope', 'GetCardsService', '$state', function($scope, $rootScope, Cards, $state){
	
	$scope.cards = {};
	 

	$scope.cards.questionCards = window.ques = [];//Cards.masterCards.filter(isQuestionCard);
    $scope.cards.answerCards  = window. answ = [];//Cards.masterCards.filter(isAnswerCard);

    $scope.games = {};
    $scope.games.players = $rootScope.Game.players;

    $scope.flipped = false;

    $scope.newCard = function(id) {
    	console.log(["ID IN", id]);
    	$scope.flipped = !$scope.flipped;
    }

    function isAnswerCard(obj, i, a) {
        if ('id' in obj && obj.cardType === "A") {
            return true;
        } else {
            return false;
        }
    }

    // ////// BREAK OUT THE QUESTION CARDS
    function isQuestionCard(obj) {
        if ('id' in obj && obj.cardType === "Q") {
            return true;
        } else {
            return false;
        }
    }

    // var qQty = Cards.masterCards.length - $scope.answerCards.length;

    // console.log("Answers: ", $scope.answerCards.length);
    // console.log("Questions: ",qQty);
    // console.log("Total Cards: ", Cards.masterCards.length);

    var randomCard = Math.floor(Math.random() * 1777) + 1;

}]);