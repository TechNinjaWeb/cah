app.factory('UserSocket', function (socketFactory, $rootScope) {
	
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

    socket.run.on('test-emitter', function(all){
    	console.log(["Test Emitter", all]);
    	$rootScope.Game.actions.stepOne();
    })


    // KEY FUNCTIONS
    socket.sendAll = function() {
    	socket.run.emit('sendAll', function(res){
	    	console.log(["Here's All the info I've got", res]);
	    })
    }

    socket.sendRooms = function() {
    	socket.run.emit('sendRooms', function(rooms){
	    	console.log(["Quick, Hide Here!", rooms]);
	    })
    }

    socket.sendUsers = function() {
    	socket.run.emit('sendUsers', function(users){
	    	console.log(["Quick, Hide Here!", users]);
	    })
    }

	return socket;
});

