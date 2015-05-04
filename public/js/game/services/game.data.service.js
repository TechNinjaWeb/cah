game.service('GameData', function(socketFactory, $rootScope, $q){
    
    var socket = window.SOCKET = {};
        socket.run = socketFactory(),
        socket.activeGames=[],
        socket.players = $rootScope.Game.players,
        socket.currentGame = [],
        socketFactory();
        window.currentGame= socket.currentGame;

    if (Parse.User.current()) $rootScope.Game.username = Parse.User.current().username;
    else $rootScope.Game.username = 'Tech Ninja';

    // Emit Get All Data On First Enter
    // socket.run.emit('sendAll');

    socket.run.forward('error');
    socket.run.forward('server', socket.server);

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


    // Update Active Games Array?
    socket.run.on('getGame', function(game){
        console.log(["Here's Your Game", game]);
        // check if it exists and update socket.activeGames
        updateActiveGames(game);
    })

    function updateActiveGames(game) {
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

    socket.run.on('getActiveGames', function(activeGames){
        console.log(["Get Active Games", activeGames]);
        
        // Empty Our Current Array
        socket.activeGames.length = 0;
        // For Each New Game
        // Add Data to socket.activeGames
        activeGames.forEach(function(e,i,a){
            // console.log(["Pusing All Active Games To socket.activeGames"]);

            // Remove Any Null Refs
            if (e.length <=0 ) console.log(["Witholding Null Value", e]);
            // Push New Object To Socket.ActiveGames
            socket.activeGames.push(e);
        });
        console.log(['Pushed Data into socket.activeGames'], ['Socket.Data', socket.activeGames])
    })

    socket.run.on('GameData', function(game){
        console.log(["Got Update Game Data -- Game  --->", game]);      
        // Handle Game Data From the Server
        saveGameData(game);      
        // Log Current Game State
        console.warn(['Updated Current Game'], ['socket.currentGame', socket.currentGame]);
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

    socket.updateGame = function(game) {
        var game = { id: game.id, data: game };

        return socket.run.emit('updateGame', game);
    }

    socket.sendActiveGames = function() {
        return socket.run.emit('sendActiveGames');
    }

    socket.loggedIn = function(){
        console.log("Logged");
        return socket.run.emit('loggedIn', $rootScope.userId);
    };

    socket.createGame = function() {
        socket.run.emit('saveGame', {
            state: 'waiting-for-players',
            active: true,
            waiting: true,
            players: [],
            currentScore: [],
            specialOptions: {},
            creator: $rootScope.userId
        })
        // Send To Game View
        console.log(['Created Game', 'emited saveGame To Socket']);
    }

    socket.joinGame = function(id) {
        // Query Parse To Find The Game
        var joinGame = new Parse.Query("Games");
            joinGame.equalTo('objectId', id);
            
            joinGame.first({
            success: function(res) {
                // Add New User And Save GameData
                console.warn(["Found Game with ID - " + id])
                var gameData=res.attributes;
                var players = gameData.players;

                console.log(["Game Data", gameData, 'Are There Players?', !!players.length]
                    , ['How Many?', players.length]
                    , [players]);
                
                // Build Player Object
                var player = {};
                player[$rootScope.userId] = {score: 0, cards: []};

                // Add Player to Parse Players List
                // Push Player if none exist
                if (!players.length) players.push(player);
                else players.forEach(function(e,i,a){
                    console.log(["This Client is index of players list?"]
                        , [ 'Echo Users Name --', $rootScope.userId ]
                        , [ 'RootScope ID == to Iteration'+i+'s ID?', e.hasOwnProperty($rootScope.userId) ]
                        , [ 'Players', players ]);
                    // If Players exist, check that 
                    // this user isn't already in the list
                    // and add them to Parse's Players Array
                    !e.hasOwnProperty($rootScope.userId) ? players.push(player) : console.log("Player Already In List");
                });
                // Save the new res
                res.save({
                    success: function(_res) {
                        // Update Local Game ID
                        $rootScope.Game.setVal('gameId', id);

                        console.warn(["Saved","Vaidate This Game Object To Update", _res.id, _res.attributes]);
                        // Adding the Game ID to the Game Object
                        _res.attributes.id = _res.id;
                        console.log(["Updated ID on Game Data Object", _res], ['sending to validate']);
//                      // ADDING THIS GAME TO OUR LOCAL
                        // GAME SAVE ARRAY SOCKET.CURRENTGAME
                        saveGameData(_res.attributes);
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
   
    // Add the Game That You've Joined
    // Or that the server has given us
    // To A Local Save Slot
    function saveGameData(game) {
        // If No Games Exits, Push Immediately
        if (socket.currentGame.length === 0) socket.currentGame.push(game);
        // Else Match the Game Id's
        else if (socket.currentGame[0].id == game.id) {
            console.log(['current game IS same Game Data in socket.current']
                , 'socket.current.game.id ==>', [socket.currentGame[0].id]
                , 'handling this game.id ==>', [game.id]);

            
            // Push new Game to last slot
            socket.currentGame.push(game);
            // Remove Game in First Slot
            socket.currentGame.shift();
            // Add Players To Local Game
            addPlayers(game);
        } else {
            console.log(['current game NOT same game data']
                , ['Is Equal?', socket.currentGame[0].id == game.id]
                , ['Currnt Game ID', socket.currentGame[0].id]
                , ['Game Data ID', game.id], ['Handle This In The Future']);
        }
    }

    function addPlayers(game) {
        // Add Player To Virtual Game
        // $rootScope.Game.addPlayer($rootScope.username, $rootScope.userId)
        game.players.forEach(function(e,i,a){
            // Add Player To Virtual Game
            console.log(["Player #"+i, e]);

            if (e.id != $rootScope.userId) $rootScope.Game.addPlayer('TEMP USER -'+i, e.id);
            else console.log(["Player is in the list Already", e]);
        })
        console.log([ "Added Players to Virtual Game", $rootScope.Game.players ])
    }

    socket.quitGame = function() {
        console.warn(["Quitting Game", socket.currentGame[0].id, "Player ID", $rootScope.userId]);
        
        socket.run.emit('quitGame', socket.currentGame[0].id, $rootScope.userId);
        socket.currentGame.length = 0;
        
        console.log(["Quit Game"], ['socket.currentGame ==>', socket.currentGame])
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
    window.techninja.actions.loggedIn = socket.loggedIn;
    // console.log(["User Socket Factory", socket]);


    return socket;
});