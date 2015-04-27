game.controller('LevelTwoController', ['$scope', '$rootScope', 'GetCardsService', '$state', function($scope, $rootScope, Cards, $state){
	 

	// $scope.cards.questionCards = window.ques = Cards.masterCards.filter(isQuestionCard);
 //    $scope.cards.answerCards  = window. answ = [];//Cards.masterCards.filter(isAnswerCard);

    $scope.game = {};
    $scope.game.players = $rootScope.Game.players;
    $scope.game.cards = {
        questions: Cards.masterCards.filter(isQuestionCard),
        answers: Cards.masterCards.filter(isAnswerCard),
        value: 'fake val',
        id: NaN
    };
    

 //    $scope.flipped = false;

    $scope.newCard = window.newCard = function(id) {
    	console.log(["ID IN", id]);
    	$scope.game.cards.value = $scope.game.cards.questions[id].text;

    }

    function isAnswerCard(obj, i, a) {
        if ('id' in obj && obj.cardType === "A") {
            return true;
        } else {
            return false;
        }
    }

 //    // ////// BREAK OUT THE QUESTION CARDS
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