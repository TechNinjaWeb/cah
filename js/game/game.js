//////////////////
// Loop Test!!!!!!
//////////////////
// window.requestAnimationFrame(loopTest);
// loopTest() // broken atm
//////////////////
//////////////////

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

var game = new GAME();
console.log("my Game", game);

// Begin Setup
if (game.waiting) game.setState('begin-game');
else "Waiting on : " + game.state;

function executeStep(listItem) {
	// Set Default Special Options
	if (listItem === 0) {
		console.log("List Item Equal to 0", listItem === 0)
		stepOne();
		if (game.specialOptions && !game.waiting) return game.logState('set-defaults');
		else return "Need Some Special Options Dude!";
	} else if (listItem === 1) {
		console.log("List Item Equal to 1", listItem === 1)
		stepTwo();
		if (game.specialOptions && !game.waiting) return game.logState('draw-ten-cards');
		else return "Need Special Options Bro!";
	} else if (listItem === 2) {
		console.log("List Item Equal to 2", listItem === 2)
		stepThree();
		if (game.players && !game.waiting) return game.logState('choose-card-czar');
		else return "Need Some Players Who Can Battle To Be Czar!";
	} else if (listItem === 3) {
		console.log("List Item Equal to 3", listItem === 3)
		stepFour();
		if (game.czar.cards.length && !game.waiting) return game.logState('czar-has-got-the-power');
		else return "Czar Needs Cards To Wield Power!";
	} else if (listItem === 4) {
		console.log("List Item Equal to 4", listItem === 4)
		stepFive();
		if (game.czar && !game.waiting) return game.logState('finished-asking-question');
		else return "Czars Are Soo Indicicive .. Choose A Card Dummy!";
	} else if (listItem === 5) {
		console.log("List Item Equal to 5", listItem === 5)
		stepSix();
		if (game.specialOptions && !game.waiting) return game.logState('choose-answer-card');
		else return "Need Some Special Options Dude!";
	} else if (listItem === 6) {
		console.log("List Item Equal to 6", listItem === 6)
		stepSeven();
		if (game.specialOptions && !game.waiting) return game.logState('czar-finished-reading');
		else return "Need Some Special Options Dude!";
	} else if (listItem === 7) {
		console.log("List Item Equal to 7", listItem === 7)
		stepEight();
		if (game.specialOptions && !game.waiting) return game.logState('winner-determined');
		else return "Need Some Special Options Dude!";
	} else if (listItem === 8) {
		console.log("List Item Equal to 8", listItem === 8)
		if (game.specialOptions && !game.waiting) return stepNine();
		else return "Need Some Special Options Dude!";
	} else {
		return "Didn't Expect It To Have More Than " + listItem.length;
	}
	
};

function stepOne() {
	clear();
	game.setState('step-one');
	game.setDefaultOptions(game.defaults)

	game.getFakePlayers(game.players);
	if (game.whiteCards && game.blackCards && !game.waiting) game.setState('get-fake-players');
	else "Getting Players";

	return game.setState('finished-step-one');
}

function stepTwo() {
	game.setState('step-two');
	// // Deal 10 Cards To All Players
	game.setState('dealing-cards');
	// console.log("WHite Cards GGGDGG", game.whiteCards);
	game.dealCards(10, game.whiteCards);
	// console.log("GIVING CZAR CARD", game.czar.giveCzarCard());
	if (game.whiteCards && !game.waiting) {}
	else return "Need Some Special Options Dude!";
	game.setState('cards-have-been-dealt');
	
}

function stepThree() {
	game.setState('step-three');
	// Choose The Czar
	game.chooseCardCzar(game.players, game.specialOptions);
	// return game.dealCards(game.blackCards.length, game.blackCards);
	return game.setState('finished-step-three');
} 
function stepFour() {
	game.setState('step-four');
	
	game.czar.chooseCard();

	return game.setState('finished-step-Four');
} 
function stepFive() {
	game.setState('step-five');
	var question = game.czar.read()[0];
	var node = document.createElement('div');
		node.innerHTML = question;

	outputWindow.appendChild(node);
	game.czar.speak(question);

	return game.setState('finished-step-five');
} 
function stepSix() {
	game.setState('step-six');

	game.players.forEach(function(e,i,a){
		var card = e.retrieveCard();
		if (!e.isCzar) return e.chooseCard();
	});

	return game.setState('finished-step-six');
} 
function stepSeven() {
	game.setState('step-seven');

	game.players.forEach(function(e,i,a){
		answers.push(e.choice);
	});
	game.czar.speak(answers);
	answers.forEach(function(e,i,a){
		var node = document.createElement('div');
			node.innerHTML = e[0][0];
		
		outputWindow.appendChild(document.createElement('br'));
		outputWindow.appendChild(node);
	});
	return game.setState('finished-step-seven');
} 
function stepEight() {
	game.setState('step-eight');
	var r = Number.prototype.Ran(3);
	var winner = game.players[r];
	console.warn('And The Winner Is!!! ---> ' + winner.name);
	winner.points ++;
	game.players.forEach(function(e,i,a){
		// Clearing Cards
		e.clearCards();
	});
	return game.setState('finished-step-eight');
} 
function stepNine() {
	game.setState('step-nine');
	game.players = [];
	
	return !!confirm("Would You Like To Play Again?") ? executeStep(0) : game.setState('play-again-soon');
} 

function clear() {
	statusWindow.innerHTML = '';
	outputWindow.innerHTML = '';
	game.answers.length = 0;

	[].forEach.call(runBtn, function(e,i,a){
			console.warn("Reenabling Buttons", e, i);
			e.className.replace('disabled', '');
			console.log("CLASS NAME", e.className);
			e.removeAttribute('class');
			e.className = 'run';
	});
	// var arr = Array.prototype.slice.call(runBtn);
	// var len = arr.length;
	// // Clear Random Last Disabled Button
	// console.log("disable this", arr[len]);
}


// Dom Stuff
var steps = document.getElementsByClassName('step'),
	runBtn = document.getElementsByClassName('run');

var list = document.getElementById('steps'),
	output = document.getElementsByClassName('output'),
	outputWindow = document.getElementsByClassName('output-window')[0],
	statusWindow = document.getElementsByClassName('status-window')[0];

// List Item Event Listeners
// [].forEach.call(steps, function(e,i,a){
//   // console.log("Iterating over -->", e);
//   // console.log("Style", e.className);
//   e.addEventListener('click', function(ev){
//     // console.log("clicked", ev);
//     var node = document.createElement('div');
//     node.innerHTML = executeStep(i);
//     statusWindow.appendChild(node);
//     console.log("Break", br);
//     statusWindow.appendChild(document.createElement('br'));
//   });
// });

// List Item Buttons Event Listeners
[].forEach.call(runBtn, function(e,i,a){
  // console.log("Iterating over -->", e);
  // console.log("Style", e.className);
  e.addEventListener('click', function(ev){
    // console.log("clicked", ev);
    var node = document.createElement('div');
    node.className += ' status';
    node.innerHTML = executeStep(i);
    statusWindow.appendChild(node);
    statusWindow.appendChild(document.createElement('br'));
    e.className += ' disabled';
  });
});

