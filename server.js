var PORT = process.env.PORT || 4000,
    express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express(),
    router = express.Router(),
    compression = require('compression'),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    sio = io.listen(server, {
        log: true,
        origins: '*:*'
    }),
    Parse = require('node-parse-api').Parse;

io.set('transports', ['websocket', 
    'flashsocket', 
    'htmlfile', 
    'xhr-polling', 
    'jsonp-polling', 
    'polling'
]);


app.set('views', __dirname + '/public/js/app/html');
app.engine('html', require('ejs').renderFile);

app.use(compression({
    filter: compressionFilter,
    level: -1
}));

var compressionFilter = function(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
    }

    // fallback to standard filter function
    return compression.filter(req, res)
}

app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'public/js/app/html'));

app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules'));
app.use('/scripts', express.static(__dirname + '/bower_components'));

// Use Custom App Routing
app.use(router);

app.use(bodyParser.json());


// Connect to Mongo DB/mongo-test
// mongoose.connect('mongodb://localhost/GameData');

// Define a Default Schema for the Table
var GameData = mongoose.Schema({
    username: String,
    gameData: []
});
// Register the Model and bind the Default Schema
var GameModel = mongoose.model('Model', GameData);

// TECH NINJA SETTINGS
// var APP_ID = "WB1IfdqCe1sBMBolX4B3EwiVho5331oCZbg9HHcT",
//     MASTER_KEY = "WilhA7uah6ko8bRLfajYcaYkC22cpakAHu7UFgq9",
//     API_KEY = 'HMRtZ755AARB0dHgtVIvUpmLSYzxm7iaXwaCQ7ng';

// ALPHANERDS SETTINGS
    var APP_ID = "qMpbJ7CGg4grTxWXnxYPJy0kgY7jUZUP6W3dkuBQ",
    MASTER_KEY = "H29KtdfOawMILC3TBYQmyKUNEiN1yBHUEHTzc7EZ",
    API_KEY = 'YdibubAy4BC0YjYwaKf3zMg19x6XsoH0NnEyjjsM';

var options = {
    app_id:APP_ID,
    api_key:API_KEY // master_key:'...' could be used too
};

var parse = new Parse(options);

var activeUsers = {},
    gameRooms = {};
    gameRooms.default = 'BiggerBlackerRoom';
    gameRooms[gameRooms.default] = gameRooms.default;

io.on('connection', function(socket) {
    // console.log("USER CONNECTED:",socket);

    // TECHNINJA IO CODE
    socket.join('BiggerBlackerRoom');

    var handshake, address,
        headers, host, origin;

        user = {},
        user.username;
        user.handshake = socket.handshake,
        user.address = socket.handshake.address,
        user.host = socket.handshake.headers.host,
        user.origin = socket.handshake.headers.origin,
        user.gameRoom = socket.gameRoom;

    // JOIN ROOM WITH HANDSHAKE ID
    socket.join(handshake);
    // SEND MESSAGE TO CLIENT ON CONNECT
    var print = [user.address,
        user.host,
        user.origin
    ];


    // TEST EMITTER
    setTimeout(function() {
        socket.emit('test-emitter', "Your User Object is " + print);
        // Log the users data
        console.log("connected to\n",
            user.address + "\n",
            // user.handshake + "\n",
            user.host + "\n",
            // user.origin + "\n",
            user.gameRoom + "\n");
    }, 5000);
    // Get Username
    socket.emit('sendUserName')


    socket.on('getUserName', function(user){
        console.log("User Sent User Name, But You HAve To Unwrap It!");
    })


    socket.emit('server', {
        message: "You've been connected to Rahims MacbookPro"
    });

    socket.on('adduser', function(userName) {
        // Add user to master list
        activeUsers[userName] = userName;
        console.log(activeUsers['Rahim\'s Macbook'], "Users List");
        socket.emit("server", "We've Added You: " + userName);
        userCheck(userName);
    });

    
    // NEWS EVENT LISTENER
    // socket.on('chatMessage', function(message) {
    //     console.log("Got Some News", message);
    //     socket.broadcast.emit('response', {
    //         'message': message.message,
    //         'id': socket.username,
    //         'userName': message.sender
    //     });
    // });


	// List Users And Rooms
    socket.on('sendAll', function(data) {
         var table = '_User',
            data = '';
        parse.findMany(table, data, function (err, res) {    
            socket.emit('getAll', {
                'gameRoom': gameRooms,
                'activeUsers': res.results.map(function(e,i,a){
                    return [e.username, {id: e.objectId, data: e}]
                })
            }, function(err){
                console.log(["error from send all", err]);
            })
            // console.log(["this elusive array", res.results]);
            return "Sent Users To Socket" + res.results;
        });
    });



    // List Rooms
    socket.on('sendRooms', function(data) {
        console.log("Sending gameRoom list to:", user);
        socket.emit('getRooms', {
            'gameRoom': gameRooms
        })
    });

    // List User and Users
    socket.on('sendUser', function(id) {
        // console.log(["FIND USER PARAMS ----->", id]);
        parse.find('_User', id, function (err, res) {
            socket.emit('getUser', res);
            console.log(['Response Data', response]);
        });
    });

    socket.on('sendUsers', function(data) {
        var table = '_User',
            data = '';
        parse.findMany(table, data, function (err, res) {    
            socket.emit('getUsers', {
                'users': res.results.map(function(e,i,a){
                    return [e.username, {id: e.objectId, data: e}]
                })
            }, function(err){
                // console.log(["error from send all", err]);
            })
            console.log(["this elusive array", res.results]);
            return "Sent Users To Socket" + res.results;
        });
        
    });


    socket.on('sendActiveGames', function(req) {
        console.log(['Send Active Games:', req]);

        parse.findMany('Games', { active: true }, function (err, res) {
            if (!res)return socket.emit('test-emitter', 'ERROR Ln:235'); 
            socket.emit('getActiveGames', res.results);

            console.log(['SEND GAME DATA END WITH RES --->', res]);
        });

        // console.log(['This Look Promising', grabData('GameData', { active: 'true'})])
    });

    socket.on('sendGame', function(game) {
        console.log(['Send Game To Client', game]);
        parse.find('Games', game, function (err, res) {
            socket.emit('GameData', res);
            console.log(['SEND GAME DATA END WITH RES --->', res]);
        });
    });

    socket.on('saveGame', function(game, user) {
        console.log(['Save Game Data In -->', game], ['USER DATA', user]);
        var params = {};
        if (typeof game == 'object') {
            console.log(["GAME OBJECT TO SAVE", 'Should look like server data', game], ['type', typeof game, 'Has Active Prop', game.hasOwnProperty('active')])
            for (p in game) {
                params[p] = game[p];
                console.log(["PROPERTY TO VERIFY", 'PARAMS', p, 'GAME VAL', game[p]]);
            }
        } else params = game;

        console.log(["Params and Properties ---->>>"], [params], ['BINGOOO', game]);

        parse.insert('Games', params, function (err, res) {
            if (err) socket.emit('test-emitter', err);
            else io.sockets.emit('GameData', game);
            console.log(['GAME DATA SAYS:', 'Saved Game'], ['Error', err]);
        });

    });

    socket.on('updateGame', function(game) {

        parse.find('Games', game.id, function (err, res) {
            console.log(["Add Player Response From Parse", res, err]);
            // Send Parse Res To Client

            console.log(["EMIT GAMESTATE TO CLIENT", game])

            parse.update('Games', game.id, game.data, function (err, res) {
                // console.log(["Response From Parse", res]);
                console.log(["Called Update Game with data -->", game]);

                io.sockets.emit('GameData', game);
            });
        });

        console.log(['Update Data ------- >', game]);

        
    });

    // socket.on('addPlayer', function(gameId, playerId) {
    //     console.log(["Adding Player -"+ gameId], ['Player Name', playerId]);
        
    //     parse.find('Games', gameId, function (err, res) {
    //         // console.log(["Response From Parse", res]);
    //         console.log(["Adding Player To This Game -->", res
    //             , 'res.players', res.attributes.players]);

    //             var player = {};
    //             player[playerId] = {score: 0, cards: []};
                
    //             res.attributes.players.push(player)

    //             console.log(['Added Player to Res', 'Saving new response', res]);


    //         parse.update('Games', gameId, _res, function (_err, _res) {
    //             console.log(["Added Player Successful", _res, _err]);

    //             io.sockets.emit('addPlayer', ['Data Deleted For ID -'+gameId]);
    //         });

    //         console.log(['Added Player To Game ID: '+gameId, 'With Name: ', playerId]);
    //     });
    // });

    socket.on('deactivateGame', function(id) {
        console.log(['Got Game ID to Deactivate', id]);
        var game = {
            active: false,
            waiting: false,
            players: [],
            state :'dead',
            currentScore: []
        }

        parse.update('Games', id, game, function (_err, _res) {
            // console.log(["Response From Parse", res]);
            console.log(["Deactivating Game -->", _res]);

            io.sockets.emit('test-emitter', ['Data Deleted For ID -'+id]);
            console.log(['Deactivated Game ID: '+id]);
        });
    });

    socket.on('cah', function(id) {
        console.log("Fuck Stephen Harper!");
    });

    socket.on('quitGame', function(id, playerName) {
        console.log(["Quit Game", id, playerName]);
        


        parse.find('Games', id, function (_err, _res) {
            // console.log(["Response From Parse", res]);
            console.log(["Remove Player From This Game -->", _res
                , '_res.players', _res.players]);

                _res.players.forEach(function(e,i,a){
                    console.Log(['Loop Iteration -', i], ['Player', e], ['Array of Players', a]);
                    console.log(['Does Requester Equal This Player?', e.hasOwnProperty(playerName)]);
                    
                    if (e.hasOwnProperty(playerName)) a.splice(i,1);
                    console.log(['Deleted User ---->', e]);
                });

                console.log(['Deleted Player', 'Saving new response', _res]);


            parse.update('Games', id, _res, function (e, r) {
                console.log(["Delete Successful", r, e]);

                io.sockets.emit('test-emitter', ['Data Deleted For ID -'+id]);
            });

            console.log(['Deactivated Game ID: '+id]);
        });
    });

    socket.on('loggedIn', function(id) {
        console.log(["User - "+id + " Logged In"]);

        parse.find('Games', {"active": true}, function (err, activeGames) {
            console.log(["Got Active Games", activeGames]);
            
            activeGames(function(e,i,a){
                console.log(["Logging Active Games", "Find User In Game"]
                    , ["Iteration - " + i]
                    , ["Game", e]
                    , [])
            });



                socket.emit('GameData', activeGames)
         

            socket.emit('test-emitter', ['Game Pushed?', !!activeGames]);
            console.log(['Log In Check Complete']);

        });
    });

    socket.on('disconnect', function(channel) {
        console.log("User Left", channel);
        socket.disconnect();
        // if (initiatorChannel) {
        //     delete gameRooms[initiatorChannel];
        // }
    });

});



// Register Default Route Catch
router.route('/')
    // Define the GET HTTP Verb Actions
    .get(function(req, res) {
        // Get All GameModel Data
        // console.log("Target Hit Route", req);
        res.render('index.html', {
            // controller: 'AppCtrl'
        });
    });
router.route('/test')
    // Define the GET HTTP Verb Actions
    .get(function(req, res) {
        // Get All GameModel Data
        // console.log("Target Hit Route", req);
        res.render('test/test.html', {
            // controller: 'AppCtrl'
        });
    });


server.listen(PORT, function() {
    console.log("Socket & Express Server Started on port %d in %s mode", this.address().port, app.settings.env)
});