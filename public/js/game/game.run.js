GAME.run(function($rootScope){
	console.log("Testing Game Run Function", $rootScope);
	//////////////////
	// Loop Test!!!!!!
	//////////////////
	// window.requestAnimationFrame(loopTest);
	// loopTest() // broken atm
	//////////////////
	//////////////////

	$rootScope.game = Game = new CAH();
	console.log("my Game", Game);

	var functions = {};
		functions.stepOne = stepOne
		, functions.stepTwo = stepTwo
		, functions.stepThree = stepThree
		, functions.stepFour = stepFour
		, functions.stepFive = stepFive
		, functions.stepSix = stepSix
		, functions.stepSeven = stepSeven
		, functions.stepEight = stepEight;
		$rootScope.game.functions = functions;

	var frame = 0;
	// Loop Test!
	function loopTest() {
		// Begn Test Case;
		if (frame>100) { test(); frame = 0 }
		else frame ++;
		console.log("Hey Bro!");
		function test() {
			stepOne();
			stepTwo();
			stepThree();
			stepFour();
			stepFive();
			stepSix();
			stepSeven();
			stepEight();

		}
	}

	// Begin Setup
	if (Game.waiting) Game.setState('begin-game');
	else "Waiting on : " + Game.state;

	function executeStep(listItem) {
		// Set Default Special Options
		if (listItem === 0) {
			console.log("List Item Equal to 0", listItem === 0)
			stepOne();
			if (Game.specialOptions && !Game.waiting) return Game.logState('set-defaults');
			else return "Need Some Special Options Dude!";
		} else if (listItem === 1) {
			console.log("List Item Equal to 1", listItem === 1)
			stepTwo();
			if (Game.specialOptions && !Game.waiting) return Game.logState('draw-ten-cards');
			else return "Need Special Options Bro!";
		} else if (listItem === 2) {
			console.log("List Item Equal to 2", listItem === 2)
			stepThree();
			if (Game.players && !Game.waiting) return Game.logState('choose-card-czar');
			else return "Need Some Players Who Can Battle To Be Czar!";
		} else if (listItem === 3) {
			console.log("List Item Equal to 3", listItem === 3)
			stepFour();
			if (Game.czar.cards.length && !Game.waiting) return Game.logState('czar-has-got-the-power');
			else return "Czar Needs Cards To Wield Power!";
		} else if (listItem === 4) {
			console.log("List Item Equal to 4", listItem === 4)
			stepFive();
			if (Game.czar && !Game.waiting) return Game.logState('finished-asking-question');
			else return "Czars Are Soo Indicicive .. Choose A Card Dummy!";
		} else if (listItem === 5) {
			console.log("List Item Equal to 5", listItem === 5)
			stepSix();
			if (Game.specialOptions && !Game.waiting) return Game.logState('choose-answer-card');
			else return "Need Some Special Options Dude!";
		} else if (listItem === 6) {
			console.log("List Item Equal to 6", listItem === 6)
			stepSeven();
			if (Game.specialOptions && !Game.waiting) return Game.logState('czar-finished-reading');
			else return "Need Some Special Options Dude!";
		} else if (listItem === 7) {
			console.log("List Item Equal to 7", listItem === 7)
			stepEight();
			if (Game.specialOptions && !Game.waiting) return Game.logState('winner-determined');
			else return "Need Some Special Options Dude!";
		} else if (listItem === 8) {
			console.log("List Item Equal to 8", listItem === 8)
			if (Game.specialOptions && !Game.waiting) return stepNine();
			else return "Need Some Special Options Dude!";
		} else {
			return "Didn't Expect It To Have More Than " + listItem.length;
		}
		
	};

	function stepOne() {
		clear();
		Game.setState('step-one');
		Game.setDefaultOptions(Game.defaults)

		Game.getFakePlayers(Game.players);
		if (Game.whiteCards && Game.blackCards && !Game.waiting) Game.setState('get-fake-players');
		else "Getting Players";

		return Game.setState('finished-step-one');
	}

	function stepTwo() {
		Game.setState('step-two');
		// // Deal 10 Cards To All Players
		Game.setState('dealing-cards');
		// console.log("WHite Cards GGGDGG", Game.whiteCards);
		Game.dealCards(10, Game.whiteCards);
		// console.log("GIVING CZAR CARD", Game.czar.giveCzarCard());
		if (Game.whiteCards && !Game.waiting) {}
		else return "Need Some Special Options Dude!";
		Game.setState('cards-have-been-dealt');
		
	}

	function stepThree() {
		Game.setState('step-three');
		// Choose The Czar
		Game.chooseCardCzar(Game.players, Game.specialOptions);
		// return Game.dealCards(Game.blackCards.length, Game.blackCards);
		return Game.setState('finished-step-three');
	} 
	function stepFour() {
		Game.setState('step-four');
		
		Game.czar.chooseCard();

		return Game.setState('finished-step-Four');
	} 
	function stepFive() {
		Game.setState('step-five');
		var question = Game.czar.read()[0];
		// var node = document.createElement('div');
		// 	node.innerHTML = question;

		// outputWindow.appendChild(node);
		Game.czar.speak(question);
		console.log(['czar reads question'], [question]);

		return Game.setState('finished-step-five');
	} 
	function stepSix() {
		Game.setState('step-six');

		Game.players.forEach(function(e,i,a){
			var card = e.retrieveCard();
			if (!e.isCzar) return e.chooseCard();
		});

		return Game.setState('finished-step-six');
	} 
	function stepSeven() {
		Game.setState('step-seven');

		Game.players.forEach(function(e,i,a){
			answers.push(e.choice);
		});
		Game.czar.speak(answers);
		answers.forEach(function(e,i,a){
			// var node = document.createElement('div');
			// 	node.innerHTML = e[0][0];
			
			// outputWindow.appendChild(document.createElement('br'));
			// outputWindow.appendChild(node);
			console.log(['answers'], [e,i,a]);
		});
		return Game.setState('finished-step-seven');
	} 
	function stepEight() {
		Game.setState('step-eight');
		var r = Number.prototype.Ran(3);
		var winner = Game.players[r];
		console.warn('And The Winner Is!!! ---> ' + winner.name);
		winner.points ++;
		Game.players.forEach(function(e,i,a){
			// Clearing Cards
			e.clearCards();
		});
		return Game.setState('finished-step-eight');
	} 
	function stepNine() {
		Game.setState('step-nine');
		Game.players = [];
		
		return !!confirm("Would You Like To Play Again?") ? executeStep(0) : Game.setState('play-again-soon');
	} 

	function clear() {
		// statusWindow.innerHTML = '';
		// outputWindow.innerHTML = '';
		// Game.answers.length = 0;

		// [].forEach.call(runBtn, function(e,i,a){
		// 		console.warn("Reenabling Buttons", e, i);
		// 		e.className.replace('disabled', '');
		// 		console.log("CLASS NAME", e.className);
		// 		e.removeAttribute('class');
		// 		e.className = 'run';
		// });

	}


	// Dom Stuff
	// var steps = document.getElementsByClassName('step'),
	// 	runBtn = document.getElementsByClassName('run');

	// var list = document.getElementById('steps'),
	// 	output = document.getElementsByClassName('output'),
	// 	outputWindow = document.getElementsByClassName('output-window')[0],
	// 	statusWindow = document.getElementsByClassName('status-window')[0];

	// // List Item Buttons Event Listeners
	// [].forEach.call(runBtn, function(e,i,a){
	//   // console.log("Iterating over -->", e);
	//   // console.log("Style", e.className);
	//   e.addEventListener('click', function(ev){
	//     // console.log("clicked", ev);
	//     var node = document.createElement('div');
	//     node.className += ' status';
	//     node.innerHTML = executeStep(i);
	//     statusWindow.appendChild(node);
	//     statusWindow.appendChild(document.createElement('br'));
	//     e.className += ' disabled';
	//   });
	// });
});