game.service('GameData', function(socketFactory, $rootScope, $q){
    
    var socket = window.SOCKET = {};
        socket.run = socketFactory(),
        socket.data=[],
        socket.players = $rootScope.Game.players,
        socket.currentGame = [],
        socketFactory();
        window.currentGame= socket.currentGame;

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
        console.log(["Server Says"], [res, 'message:', res.message]);
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

     socket.addPlayer = function(username, id, game) {
        console.log(["ATTEMPTING TO ADD THIS CHARACTER", username, id, game]);

        var parsedUser = {
            userId: Parse.User.current().id || 'Not A Member',
            name: username,
            cards: [],
            choice: [],
            isCzar: false,
            state: 'player-created-'+username,
            points: 0,
        };
        // Emit New Player Data
        socket.run.emit('addPlayer', game, parsedUser);
    }


    // Game Play Features
    socket.run.on('getGame', function(game){
        console.log(["Here's Your Game", game]);
        // check if it exists and update socket.data
        validate(game);
    })

    socket.joinGame = window.joinGame = function(id) {
        // Query Parse To Find The Game
        var query = new Parse.Query("GameData");
            query.equalTo('objectId', id);
            
            query.first({
            success: function(res) {
                // Add New User And Save GameData
                var gameData=res.attributes;
                var players = gameData.players;

                console.log(["Game Data Attribs", gameData, 'Are There Players?', !!players.length, players.length, players]);

                // Add Player To Virtual Game
                if(players.length<=0) socket.addPlayer(Parse.User.current().username || $rootScope.Game.username || 'No User Ln:130', id, gameData);
                else 'Sending Player To UpdateGame Emitter Instead';

                res.save({
                    success: function(res) {
                        // Update Local Game ID
                        $rootScope.Game.setVal('gameId', id);

                        console.warn(["Saved","Vaidate This Game Object To Update", res.id, res.attributes]);
                        
                        res.attributes.id = res.id;
                        console.log(["Updated ID on attributes.id", res], ['sending to validate']);
//                      // SENDING TO VALIDATE
                        validate(res.attributes);
                    },
                    error: function(res,err) {
                        console.warn(['Error', res,err]);
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

    socket.run.on('getActiveGames', function(res){
        console.log(["Get Active Games", res]);
        socket.data.length = 0;
        res.forEach(function(e,i,a){
            // Send Each Item To Data Array
            // console.log(["Pusing All Active Games To socket.data"]);
            // Push Each Game into Array
            if (e.length <=0 ) console.log(["Witholding Null Value", e]);
            // Reset Current Games List
            socket.data.push(e);
        });
        console.log(['Pushed Data into socket.data'], ['Socket.Data', socket.data])
    })



    socket.run.on('GameData', function(game){
        console.log(["Got Update Game Data -- Game  --->", game]);      
// PUSHING TO SOCKET.CURRENTGAME
        // If Current Game is Empty Push
        
        // Handle Game Data To
        // Be Updated
        handle(game)
        
        // Push updated Game State
        // Log Current Game State
        console.warn(['Updated Current Game'], ['socket.currentGame', socket.currentGame]);
     
    })

    socket.run.on('addPlayer', function(username, gameData){
        console.warn(['ATTEPTING TO ADD PLAYER', 'username', username, 'GameData', gameData]);
        $rootScope.Game.addPlayer(username, id, game);

    })

    

    function validate(game) {
        // Compare socket.data with game.id
        socket.data.forEach(function(e,i,a){
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
            console.log(['VALIDATION RESPONSE', 'E', e], [game.id]);
        })
////////// FULL GAME OUTPUT TO SERVER
        // socket.updateGame(game);
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
                , ['Game Data ID', game.id]);
        }
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
    window.techninja.actions.createGame = socket.createGame;
    window.techninja.actions.joinGame = socket.joinGame;




    return socket;
});



// socket.run.on('GameData', function(game){
//     console.log(["Got Update Game Data -- Game  --->", game]);

//     socket.data.forEach(function(data,i,a){
//         // If E.ID == game.id,
        
//         // DEBUG LINES
//         // if (e.id == game.id) console.log("Hey Were Equal", [e.id == game.id], [e.id, game.id]);
//         // else console.log("This one's a dupe", [e.id]);
   
// // PUSHING TO SOCKET.CURRENTGAME
//         // 
//         if (!socket.currentGame.length)
//             socket.currentGame.push(game);
//         if (socket.currentGame[0].id == game.id)
//             socket.currentGame.push(game);

//         console.log(['Updated Current Game'], ['socket.currentGame', socket.currentGame]);
        
//         console.log(['Compare IDs'], ['socket.data el', data], ['game', game], ['pushing to socket.data?', split]);
//     })
 
// })
