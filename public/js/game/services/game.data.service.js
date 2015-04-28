game.service('GameData', function(socketFactory, $rootScope, $q){
    
    var socket = window.SOCKET = {};
        socket.run = socketFactory(),
        socket.activeGames=[],
        socket.players = $rootScope.Game.players,
        socket.currentGame = [],
        socketFactory();
        window.currentGame= socket.currentGame;

    // Game Data Factory
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
    window.techninja.actions.createGame = socket.createGame;
    window.techninja.actions.joinGame = socket.joinGame;

    if (Parse.User.current()) $rootScope.Game.username = Parse.User.current().username;
    else $rootScope.Game.username = 'Tech Ninja';

    var deferred = $q.defer();
    // console.log(["User Socket Factory", socket]);

    socket.run.forward('error');
    socket.run.forward('server', socket.server);

    // Emite Get All Data On First Enter
    socket.run.emit('sendAll');
    if (Parse.User.current() && Parse.User.current())

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

    socket.updateGame = function(game) {
        var game = { id: game.id, data: game };

        return socket.run.emit('updateGame', game);
    }

    socket.sendActiveGames = function() {
        return socket.run.emit('sendActiveGames');
    }

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

    socket.quitGame = function() {
        console.warn(["Quitting Game", socket.currentGame[0].id, "Player", $rootScope.username]);
        console.warn(['Current Game', socket.currentGame[0]])
        
        socket.run.emit('quitGame', socket.currentGame[0].id, $rootScope.username);
        socket.currentGame.length = 0;
        
        console.log(["Quit Game"])
    }

    socket.deactivateGame = function() {
        console.warn(["Game Data:", 'Shutting Down Game'], ['Functions to Make'
            , 'Destroy Current Game Save Array'
            , 'Change Server active value to false']);

        console.warn(['Current Game', socket.currentGame])
        socket.run.emit('deactivateGame', socket.currentGame[0].id);
        socket.currentGame.length = 0;
        console.log(["Deactivated Game"])
    }

     socket.addPlayer = function(username, id, game) {
        console.log(["ATTEMPTING TO ADD THIS CHARACTER", username, id, game]);

        var player = {
            userId: id,
            name: username,
            cards: [],
            choice: [],
            isCzar: false,
            state: 'player-created-'+username,
            points: 0,
        };
        // Emit New Player Data
        socket.run.emit('addPlayer', game.id, player.name);
    }

    socket.joinGame = function(id) {
        // Query Parse To Find The Game
        var query = new Parse.Query("Games");
            query.equalTo('objectId', id);
            
            query.first({
            success: function(res) {
                // Add New User And Save GameData
                console.warn(["Found Game with ID - " + id])
                var gameData=res.attributes;
                var players = gameData.players;

                console.log(["Game Data", gameData, 'Are There Players?', !!players.length]
                    , ['How Many?', players.length]
                    , [players]);
                
                // Add Player To Virtual Game
                var player = {};
                player[$rootScope.username] = {score: 0, cards: []};

                // Push Player if none exist
                if (!players.length) players.push(player);
                // If Players exist, check that 
                // this user isn't already added
                players.forEach(function(e,i,a){
                    console.log(["This Client is index of players list?"
                        , 'Echo Users Name --', $rootScope.username
                        , e.hasOwnProperty($rootScope.username)
                        , 'Players', players]);

                    !e.hasOwnProperty($rootScope.username) ? players.push(player) : console.log("Player Already In List");
                })
                // Save the new res
                res.save({
                    success: function(_res) {
                        // Update Local Game ID
                        $rootScope.Game.setVal('gameId', id);

                        console.warn(["Saved","Vaidate This Game Object To Update", _res.id, _res.attributes]);
                        
                        _res.attributes.id = _res.id;
                        console.log(["Updated ID on attributes.id", _res], ['sending to validate']);
//                      // SENDING TO VALIDATE
                        handle(_res.attributes);
                    },
                    error: function(_res,_err) {
                        console.warn(['Error', _res,_err]);
                    }
                });

                return gameData;
            },
            error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            })

        return "Completing Your Request";
    }
   

    function validate(game) {
        // Compare socket.activeGames with game.id
        socket.activeGames.forEach(function(e,i,a){
            console.log(['VALIDATING GAME','game.id'], [game.id]);
            // Check Ids
            // e.id == game.id?
            if (e.id == game.id) {
                console.log(['IDS Match', 'allow update'], ['e.id'
                    , e.id
                    , 'game.id'
                    , game.id]);
////////// FULL GAME OUTPUT TO SERVER
                socket.updateGame(game);
            }
        })
    }

    function handle(game) {
        if (socket.currentGame.length === 0) socket.currentGame.push(game);
        else if (socket.currentGame[0].id == game.id) {
            console.log(['current game IS same game data']
                , [socket.currentGame[0].id == game.id]
                , [socket.currentGame[0].id]
                , [game.id]);
            socket.currentGame.push(game);
            socket.currentGame.shift();
        } else {
            console.log(['current game NOT same game data']
                , ['Is Equal?', socket.currentGame[0].id == game.id]
                , ['Currnt Game ID', socket.currentGame[0].id]
                , ['Game Data ID', game.id], ['Handle This In The Future']);
        }
    }

    // KEY LISTENERS

    socket.run.on('connect', function(){
        console.log(["User Connected"]);
    })

    socket.run.on('server', function(res){
        console.log(["Server Says"], [res, 'message:', res.message]);
    })

    // Working When Emitter On Page
    socket.run.on('getAll', function(data){
        console.log(["Listing data Users", data]);
    })

    socket.run.on('getRooms', function(data){
        console.log(["Listing All Rooms", all]);
    })

    socket.run.on('getUsers', function(allUsers){
        console.log(["Listing Users", allUsers]);
    })

    socket.run.on('getUser', function(user){
        console.log(["User Object From Server: ", user]);
    })


    socket.run.on('test-emitter', function(all){
        console.log(["Test Emitter", all]);
        
        // Future Hook Event
        // $rootScope.Game.actions.stepOne();
    })

    // Game Play Features
    socket.run.on('getGame', function(game){
        console.log(["Here's Your Game", game]);
        // check if it exists and update socket.activeGames
        validate(game);
    })

    socket.run.on('getActiveGames', function(res){
        console.log(["Get Active Games", res]);
        socket.activeGames.length = 0;
        res.forEach(function(e,i,a){
            // Send Each Item To Data Array
            // console.log(["Pusing All Active Games To socket.activeGames"]);
            // Push Each Game into Array
            if (e.length <=0 ) console.log(["Witholding Null Value", e]);
            // Reset Current Games List
            socket.activeGames.push(e);
        });
        console.log(['Pushed Data into socket.activeGames'], ['Socket.Data', socket.activeGames])
    })



    socket.run.on('GameData', function(game){
        console.log(["Got Update Game Data -- Game  --->", game]);      
        // Handle Game Data To
        // Be Updated
        handle(game);      
        // Push updated Game State
        // Log Current Game State
        console.warn(['Updated Current Game'], ['socket.currentGame', socket.currentGame]);
     
    })

    socket.run.on('addPlayer', function(username, gameData){
        console.warn(['ATTEPTING TO ADD PLAYER', 'username', username, 'GameData', gameData]);
        $rootScope.Game.addPlayer(username, id, game);

    })




    return socket;
});

