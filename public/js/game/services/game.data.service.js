game.service('GameData', function(socketFactory, $rootScope, $q){
    
    var socket = window.SOCKET = {};
        socket.run = socketFactory(),
        socket.data=[],
        socket.currentGame=[],
        socketFactory();


    if (Parse.User.current()) $rootScope.Game.username = Parse.User.current().username;
    else $rootScope.Game.username = 'Tech Ninja';

    var deferred = $q.defer();
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
    socket.run.on('getAll', function(data){
        console.log(["Listing data Users", data]);
    })

    socket.run.on('getRooms', function(data){
        console.log(["Listing All Rooms", all]);
    })

    socket.run.on('getUsers', function(all){
        console.log(["Listing Users", all]);
    })

    socket.run.on('getUser', function(user){
        console.log(["User Object From Server: ", user]);
    })


    socket.run.on('test-emitter', function(all){
        console.log(["Test Emitter", all]);
        
        // Future Hook Event
        // $rootScope.Game.actions.stepOne();
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

    socket.saveGame = function(game) {
        return socket.run.emit('saveGame', game);
    }

    socket.sendGame = function(id) {
        return socket.run.emit('sendGame', id);
    }

    socket.updateGame = function(id, data) {
        var game = { id: id, data: data };

        return socket.run.emit('updateGame', game);
    }

    socket.sendActiveGames = function() {
        return socket.run.emit('sendActiveGames');
    }


    // Game Play Features
    socket.run.on('getGame', function(game){
        console.log(["Here's Your Game", game]);
        // check if it exists and update socket.data
        validate(game);
    })

    socket.run.on('getActiveGames', function(res){
        console.log(["Get Active Games", res]);
        socket.data.length = 0;
        res.forEach(function(e,i,a){
            // Send Each Item To Data Array
            console.log(["Pusing All Active Games To socket.data"]);
            // Push Each Game into Array
            if (e.length <=0 ) console.log(["Witholding Null Value", e]);
            socket.data.push(e);
        });
        console.log(['Pushed Data into socket.data'], ['Socket.Data', socket.data])
    })


    socket.run.on('saveGame', function(game){
        console.log(["Game Has Been Saved", game]);
        // Validate Game and Push 
        // If It's Newer
//      validate(game);
        console.warn(["PUSHING GAME DATA", "\n" +"\n"], ['game', game]);
        // Call Socket Update On Game ID and Data
    })

    socket.run.on('GameData', function(game){
        console.log(["Got Update Game Data -- Game  --->", game]);

        socket.data.forEach(function(e,i,a){
            // If E.ID == game.id,
            // socket.data.shift() and socket.data.push(e);
            console.log(['Compare IDs'], ['socket.data el, e'], ['game', game]);
        })
     
    })

    socket.run.on('addPlayer', function(gameData){
        console.warn(['NULL FUNCTION', gameData]);
        

    })


    socket.createGame = function() {
        socket.run.emit('saveGame', {
            state: 'waiting-for-players',
            active: true,
            waiting: true,
            techninja: $rootScope.Game.username,
            players: [],
            currentScore: [],
            specialOptions: {}
        })
        // Send To Game View
        console.log(['Created Game', 'emited saveGame To Socket']);
    }

    socket.joinGame = window.joinGame = function(id) {
        // Query Parse To Find The Game

       
    }
    
    function addPlayer(username, id, gameData) {
        
    }

    function validate(game) {
        // Compare socket.data with game.id

        socket.data.forEach(function(e,i,a){
            // Check Ids
            // e.id == game.id?
            console.log(['VALIDATION RESPONSE', 'E', e], [game.id]);
        })

        // socket.updateGame(game);
    }


    window.techninja = {};
    window.techninja.actions = {};
    window.techninja.actions.sendAll = socket.sendAll;
    window.techninja.actions.sendRooms = socket.sendRooms;
    window.techninja.actions.sendUsers = socket.sendUsers;
    window.techninja.actions.sendUser = socket.sendUser;
    window.techninja.actions.sendGame = socket.sendGame;
    window.techninja.actions.saveGame = socket.saveGame;
    window.techninja.actions.sendActiveGames = socket.sendActiveGames;
    window.techninja.actions.updateGame = socket.updateGame;
    window.techninja.actions.addPlayer = addPlayer;
    window.techninja.actions.createGame = socket.createGame;
    window.techninja.actions.joinGame = socket.joinGame;
    window.ADDPLAYER = addPlayer;




    return socket;
});