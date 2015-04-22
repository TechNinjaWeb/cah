var count = 0;
// Create Player Class Object
var player = window.player = function(na,c, _id){
	var self = this;
	return (function(name, cards, id){
		
		var s = this
		id += 1;
		
		return {
			id: id,
			name: name,
			cards: cards,
			choice: [],
			isCzar: false,
			state: 'player-created',
			points: 0,
			setCards: function(cards) {
				return this.cards = cards;
			},
			setChoice: function(i) {
				return this.choice = this.cards[i];
			},
			clearCards: function() {
				return this.cards.length = 0;
			},
			clearAttrib: function(name) {
				if (this.name == 'string') return this.setAttrib('name', '');
				else if (Array.isArray(this.name)) return this.setAttrib('name', '');
			},
			chooseCard: function() {
				var ind = Number.prototype.Ran(this.cards.length);
				this.setChoice(ind);
				this.cards.splice(ind,1);
				return ind;
			},
			setAttrib: function(a, val) {
				return this[a] = val;
			},
			sayName: function() {
				return 'My Name Is: ' + this.name;
			},
			sayAttribValue: function(atr, prefix) {
				return "" + prefix + ": " + this[atr];
			},
			getVal: function(atr) {
				return this[atr];
			},
			getName: function() {
				return this.name;
			},
			retrieveCard: function() {
				return this.choice;
			},
			setInternalState: function(value)  {
				// console.warn("Player State Params Changed To:", value);
				return this.state = value;
			},
			getParentAttribute: function(val) {
				return getVal(val);
			},
			roleCall: function(id) {
				if (id == this.id) return this;
				else "Oh, You Lookin' For Pookie In D-Block";
			}
		}
	}(na || '', c || [], _id || 0)); 
};
player.prototype = new player('basic', []);

// Create Czar Class Object
var czar = window.czar = function(na,c){
	var self = this;
	return (function(name, cards){
		return {
			name: name,
			cards: cards,
			cardToRead: [],
			state: 'czar-has-been-chosen',
			read: function() {
				console.log("Card To Read!", this.cardToRead);
				console.log("Attempting to read this card!", this.cardToRead[0][0]);
				return this.cardToRead[0][0][0];
			},
			setCard: function(i) {
				return this.cardToRead = [this.cards[i], i];
			},
			setCards: function(cards) {
				return this.cards = cards;
			},
			clearCard: function() {
				return this.cards.length = 0;
			},
			clearAttrib: function(name) {
				if (this.name == 'string') return this.setAttrib('name', '');
				else if (Array.isArray(this.name)) return this.setAttrib('name', '');
			},
			chooseCard: function() {
				var ind = Number.prototype.Ran(this.cards.length);
				this.setCard(ind);
				// console.log("Setting Card To Read", i, this.cards);
				this.cards.splice(ind,1);
				return ind;
			},
			setAttrib: function(a, val) {
				return this[a] = val;
			},
			sayName: function() {
				return 'My Name Is: ' + this.name + " and I Am The Czar";
			},
			sayAttribValue: function(atr, prefix) {
				return "" + prefix + ": " + this[atr];
			},
			getVal: function(atr) {
				return this[atr];
			},
			retrieveCard: function() {
				return this.cardToRead;
			},
			setInternalState: function(value)  {
				// console.warn("Player State Params Changed To:", value);
				return this.state = value;
			},
			speak: function(val) {
				console.warn(val);
			}
		}
	}(na || '', c || [])); 
};
czar.prototype = new czar();

var ACTORS = window.ACTORS = {
	player: player,
	czar: czar,
	get: function(id) {
		return player().roleCall(id);
	}
}

ACTORS.prototype = {};
ACTORS.prototype.player = new player();
ACTORS.prototype.czar = new czar();