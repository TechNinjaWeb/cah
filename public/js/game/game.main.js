var br = "\n";
var sec = "-----------";
var scbr = br + sec + br;

var CAH = function() {
	return (function(g,ch){
		var player = ch.player,
			czar = ch.czar;
		var gameId = g.gameId = '', state = g.state = {}, active = g.active = false, updateLoop = g.updateLoop = [], whiteCards = g.whiteCards = [], blackCards = g.blackCards = [], defaults, 
			specialOptions = g.specialOptions = {},
			players = g.players = [], pByName = players.pByName = g.players.pByName = {}, totalPlayers = g.players.total = -2;
			players.czar = g.czar = '', waiting = g.waiting = false, answers = g.answers = [],
			defaults = {
				chooseCardCzar: 'Default',
				newCardExchange: true || false,
				winnerSelection: 'getLoudestAnswer' || 'voteForBestAnswer'
			};

		var Random = Number.prototype.Ran;
		var count = 0;

		// Game Factory
		g.nextAction = nextAction,
		g.resetGame = resetGame,
		g.setDefaultOptions = setDefaultOptions,
		g.newCardExchange = newCardExchange,
		g.chooseCardCzar = chooseCardCzar,
		g.giveCzarCard = giveCzarCard,
		g.getState = getState,
		g.setState = setState,
		g.logState = logState,
		g.getVal = getVal,
		g.setVal = setVal,
		g.drawOneCard = drawOneCard,
		g.drawManyCards = drawManyCards,
		g.addPlayer = addPlayer,
		g.dealCards = dealCards,
		g.players.get = ch.get,
		g.czar.get = ch.get,
		g.players.newPlayer = ch.player,
		g.czar.newCzar = ch.czar;
		// Get Cards
		var wc = g.wc = ajaxRequest('/api/wcards.json', 'GET', [], {}).then(function(res){ 
			var sp= res.split('#####');  
			par = JSON.parse(sp[0]);
			ls = [];

			// console.log("White Cards", par.length);
			whiteCards = par.forEach(function(e,i,a){
				return ls.push([e,{id: i, data: a}]);
			});
			// console.log("WHITE CARDS CARDS", ls, whiteCards);
			g.whiteCards.push(ls);
			return res;
		});
		var bc = g.bc = ajaxRequest('/api/bcards'+ (Random(0,2,1) +1) +'.json', 'GET', [], {}).then(function(res){ 
			var sp= res.split('#####'); 
			var par = JSON.parse(sp);
			var ls= [];

			// console.log("CHECK SPLIT", sp);
			// console.log("Split", sp.length);
			// console.warn("SP 0", sp[3]);
			blackCards = sp.forEach(function(e,i,a){
				return ls.push([e,{id: i, data: a}]);
			});
			// console.log("BLACK CARDS", ls, blackCards);
			g.blackCards.push(ls);
			return res;
		});

		function newCard(pointer, num) {
			return pointer[Random(0, 1, pointer.length)]
		}

	
		// Get Current State, Set New State,
		// Apply A New Action on data
		// And Return A Promise
		function nextAction(state, f, data) {
			setState('next-action');
			return new Promise(function(res, rej){
				setState(state);
				console.log("State and Data", state, data);
				// Apply Function
				var r = f(data) || false;
				return res(r);
			});
		};	

		function dealCards(num, cards) {
			setState('deal-cards');
			players.forEach(function(e,i,a){
				console.log("Dealing TO ", e.name, "Cards", cards);
				var tenCardHand = drawManyCards(cards, num);
				console.log("Ten Card Hand", tenCardHand);
				e.setCards(tenCardHand);
			});
			setState('cards-have-been-dealt');
			return "Cards Have Been Dealt";
		};

		function chooseCardCzar(p, options) {
			setState('choose-card-czar');
			if (!p) return "Please Provide Players";
			// Set New Card Czar
			// if (options.chooseCardCzar)
			
			var cz = p[Random(p.length)];
			// Give Black Cards
			// cz.setCards(blackCards);
			// cz.setChoice(drawOneCard( blackCards ));
			g.czar = new czar(cz.name, []);
			// console.log("CZARRRRRRR", g.czar)
			
			// Loop over crappy Black Cards Array	
			Array.prototype.forEach.call(g.blackCards[0], function(e,i,a){
				// console.log("Each Black Card ---->", e);
				g.czar.cards.push(drawManyCards(g.blackCards, 1));
			});
			
			return "Czar Has Been Chosen! Name: " + g.czar.name;
		};

		function giveCzarCard(c) {
			
			return c.chooseCard();
		};

		function drawOneCard(array) {
	        // console.log(singleNum[0], "Single Number Called");
	        return array[0].splice(Random(array.length), 1);
	    }

	    function drawManyCards(array, num) {
	    	num = num || 1;
			var cards = [];
			var r = Random(array.length);
			for(i=0;i<num;i++) cards.push(drawOneCard(array, num));
			console.warn("Cards", cards);
	    	return cards;

	    }

		function giveWinnerPoint() {};

		// Special Play Options
		function getLoudestAnswer() {};

		function voteForBestAnswer() {};

		function newCardExchange(answers) {
			for (p in answers) if (answers[prop] == 'new-card') return;
		};

		function setSpecialOption(name, value) {
			return specialOptions[name] = value;
		};

		function setDefaultOptions(o) {
			for(p in o) setSpecialOption(p, o[p]);
		};

		// State Checkers
		function getState() {
			return this.state;
		};

		function setState(value)  {
			console.log("State Params Changed To:", value);
			return this.state = value;
		};

		function logState(value) {
			console.warn("State Params Changed To:", value);
			return this.state = value;
		};

		function getVal(obj, name) {
			return obj[name];
		};

		function setVal(obj, val) {
			var token = this[obj] = val;
			// console.log(["From Deep IN Main", obj, val], [token])
			return token;
		};

		function changeVal(atr, val) {
			return this[atr] = val;
		};

		function resetGame() {
			g.players = [];
			g.czar = {};
			setState('game-has-been-reset');
			return "Game Has Been Reset, Enjoy!";
		}


	    function ajaxRequest(url, method, headers, data) {
	        return arguments.length == 4 ? new Promise(function(resolve, reject) {
	            // console.log("URL", url, "\nHEADERS", headers, "\nMETHOD", method, "\nDATA", data);
	            var xhr = new XMLHttpRequest();
	            xhr.open(method, url, true),
	                headers.forEach(function(e, i, a) {
	                    xhr.setRequestHeader(e[0], e[1]);
	                });

	            xhr.onreadystatechange = function() {
	                if (xhr.readyState === 4 && xhr.status === 200) {
	                	// console.warn("Success", xhr.responseText);
	                    return resolve(xhr.responseText);
	                }
	                if (xhr.readyState === 4 && xhr.status === 400) {
	                    // console.warn("Success But Error Found", xhr.responseText);
	                    return reject(false);
	                }
	                if (xhr.readyState === 4 && xhr.status === 404) {
	                    // console.warn("Success But Page Not Found", xhr.responseText);
	                    return reject(false);
	                }
	                if (xhr.readyState === 4 && xhr.status === 500) {
	                    // console.warn("Success But Server Error", xhr.responseText);
	                    return reject(false);
	                }
	            }

	            //Stringify Data for Send To Server
	            data = JSON.stringify(data);
	            xhr.send(data);

	            // console.log("XHR OBJECT", xhr, "DATA", data);
	        }) 
	        : !url 
	            ? console.log("Please Input Url")
	            : !method ? console.log("Please Input Method")
	            : !headers ? console.log("Please Input Headers")
	            : !data ? console.log("Please Input Data") : null;
	    }
	    

	    function addPlayer(username, id, game) {
	    	console.log(["Cards in fake players"], [id, username]);
	    	g.players.push(new player(username, id));
	    	// console.log("Fake Players Populated", g.players);
	    	return pbyName = g.players.map(function(e,i,a){
	    		var token = pByName[e.name] = { id: i, data: a[i] };
	    		return token;
	    	});
	    }

		// console.log("GAME", g);
		return g;
	}( {}, ACTORS || {} ));
}