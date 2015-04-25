game.service('GameData', function(socketFactory, $rootScope){
	
	var socket = window.SOCKET = {};
	socket.run = socketFactory(),
	socketFactory();
	// console.log(["User Socket Factory", socket]);

	socket.run.forward('error');
	socket.run.forward('server', socket.server);

    // Emite Get All Data On First Enter
    socket.run.emit('sendAll');


    // KEY LISTENERS

    socket.run.on('connect', function(){
    	console.log(["User Connected"]);
    })

    socket.run.on('server', function(res){
    	console.log(["Server Says", res.message], [res]);
    })

    // Working When Emitter On Page
    socket.run.on('getAll', function(all){
    	console.log(["Gimme Gimme", all]);
    })

    socket.run.on('getRooms', function(all){
    	console.log(["Gimme Rooms", all]);
    })

    socket.run.on('getUsers', function(all){
    	console.log(["Gimme Users", all]);
    })

    socket.run.on('getUser', function(user){
        console.log(["User Object From Server: ", user]);
    })

    socket.run.on('getGame', function(game){
        console.log(["Finally A Game", game]);
    })

    socket.run.on('saveGame', function(res){
        console.log(["Game Has Been Saved", res]);
    })

    socket.run.on('gameState', function(state){
        console.log(["Server Has Updated State", state]);
    })

    socket.run.on('test-emitter', function(all){
        console.log(["Test Emitter", all]);
        $rootScope.Game.actions.stepOne();
    })


    // KEY FUNCTIONS
    socket.sendAll = function() {
    	return socket.run.emit('sendAll')
    }

    socket.sendRooms = function() {
    	return socket.run.emit('sendRooms')
    }

    socket.sendUsers = function() {
    	return socket.run.emit('sendUsers')
    }

    socket.sendUser = function(user) {
        return socket.run.emit('sendUser', user);
    }

    socket.sendGame = function(id) {
        return socket.run.emit('sendGame', id);
    }

    socket.saveGame = function(game) {
        return socket.run.emit('saveGame', game);
    }

    socket.updateGame = function(id, data) {
        var game = { id: id, data: data };
        return socket.run.emit('updateGame', game);
    }

    window.techninja = {};
    window.techninja.actions = {};
    window.techninja.actions.sendAll = socket.sendAll;
    window.techninja.actions.sendRooms = socket.sendRooms;
    window.techninja.actions.sendUsers = socket.sendUsers;
    window.techninja.actions.sendUser = socket.sendUser;
    window.techninja.actions.sendGame = socket.sendGame;
    window.techninja.actions.saveGame = socket.saveGame;
    window.techninja.actions.updateGame = socket.updateGame;

    window.techninja.game = {
        active: true,
        players: {
            'Jack': 'id',
            'Jill': 'id',
            'James': 'id'
        },
        currentScore: [{'Jack': 1}, {'Jill': 2}, {'James': 5}],
        specialOptions: {},
        state: '',
        waiting: false
    };

	return socket;
});