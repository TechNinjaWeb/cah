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


// parse.insertCustom('users', { 
//   username: 'tom@j.com', 
//   password: 'wow'
// }, function (err, response) {
//   console.log(response);
// });

// the Foo with id = 'someId'
// parse.find('Foo', 'oetN4soa40', function (err, response) {
//   console.log(response);
// })

// parse.delete('User', '9h5a6asuv9', function (err) {
//   // nothing to see here
//   console.log(["Error", err]);
// });


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

    socket.on('saveGame', function(game) {
        console.log(['Save Game Data In -->', game]);
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

    // socket.on('addPlayer', function(game, userData) {
    //     console.log(['Adding Players To Game ---- >', game, userData]);
    //     // Parse Update
    //     // game.data.players.push(userData);
    //     parse.update('Games', game.id, game.data, function (err, res) {
    //         console.log(["Add Player Response From Parse", res, err]);
            
    //         // Send Parse Res To Client
    //         console.log(["EMIT GAMESTATE TO CLIENT", game])

    //         // Send Update To Client
    //         io.sockets.emit('GameData', game);
    //     });

    //     $rootScope.Game.addPlayer(userData.username, 
        
    // });




    // // Create A Room
    // socket.on('createRoom', function(room) {
    //     gameRoom.push(room);
    //     socket.emit('updategameRoom', gameRoom, socket.room);
    //     console.log('Update All Users with New Rooms', gameRoom, socket.room);
    // });

    // // Switch Rooms
    // socket.on('switchRoom', function(newroom) {
    //     var oldroom;
    //     oldroom = socket.room;
    //     socket.leave(socket.room);
    //     socket.join(newroom);
    //     socket.emit('updatechat', 'you have connected to ' + newroom);
    //     socket.broadcast.to(oldroom).emit('updatechat', socket.username + ' has left this room');
    //     socket.room = newroom;
    //     socket.broadcast.to(newroom).emit('updatechat', socket.username + ' has joined this room');
    //     socket.emit('updategameRoom', gameRoom, newroom);
    // });

    // socket.on('privateMessage', function(username, message) {
    //     socket.broadcast.to(username).emit(message);
    //     console.log("Private Message to: " + username);
    // });

    socket.on('disconnect', function(channel) {
        console.log("User Left", channel);
        socket.disconnect();
        // if (initiatorChannel) {
        //     delete gameRooms[initiatorChannel];
        // }
    });


    // socket.on('new-channel', function(data) {
    //     console.log("NEW-CHANNEL DATA", data);
    //     if (!gameRooms[data.channel]) {
    //         initiatorChannel = data.channel;
    //     }
    //     console.log("SERVER DATA", data)
    //     gameRooms[data.channel] = data.channel;
    //     onNewNamespace(data.channel, data.sender);
    // });


    // function onNewNamespace(channel, sender) {
    //     console.log("ONNEWNAMESPACE -- Client Calling for new channel, channel & sender", channel, sender)
    //     io.of('/' + channel).on('connection', function(socket) {
    //         var username;
    //         if (io.isConnected) {
    //             io.isConnected = false;
    //             socket.emit('connect', true);
    //             console.log("User Is Now Connected To: ")
    //         } else console.log("User Not Connected Socket: ", socket)

    //         socket.on('message', function(data) {
    //             console.log("Message Event - With Data: ", data)
    //             if (data.sender == sender) {
    //                 if (!username) username = data.data.sender;

    //                 socket.broadcast.emit('message', data.data);
    //             }
    //         });

    //         socket.on('disconnect', function() {
    //             if (username) {
    //                 socket.broadcast.emit('user-left', username);
    //                 username = null;
    //             }
    //         });
    //     });


    // }

    









    // Future Implementation
    // Mongo DB 

    // router.route('/GameData')
    // // Define the GET HTTP Verb Actions
    // .get(function(req, res) {
    //     // Get All GameModel Data
    //     console.log("Target Hit Route", req);
    //     GameModel.find(function(err, requestedData) {
    //         // If Error send, else send requested data
    //         !!err ? res.send(err) : res.send(requestedData);
    //     })
    // })
    // // Define the POST HTTP Verb Actions
    // .post(function(req, res) {
    //     // Create New Instantiation of Schema
    //     // and set properties





    //     console.log(["GAME DATA REQUEST", req.body || req.params]);

    //     var insertInTable = new GameModel({
    //         username: req.params.username,
    //         gameData: req.params.gameData
    //     });

    //     insertInTable.save(function(err, saved) {
    //         console.log("saved._id", saved._id);
    //         !!err ? res.send(err) : res.send({
    //             message: "Added Data",
    //             id: saved._id
    //         });
    //     });
    // });




    // // Register New Dynamic Route for ID
    // router.route('/GameData/:id')
    // // Define the GET HTTP Verb Actions
    //     .get(function(req, res) {
    //         // Get Result Equal to ID
    //         GameModel.findOne(function(err, requestedData) {
    //             // If Error send, else send requested data
    //             !!err ? res.send(err) : res.send(requestedData);
    //         })
    //     })
    //     // Define the PUT HTTP Verb Actions
    //     .put(function(req, res) {
    //         // Find the Data Object Equal to the
    //         // ID from the req.params object
    //         GameModel.findOne({
    //             _id: req.params.id
    //         }, function(err, requestedData) {
    //             // Set the Data equal to
    //             // new requested user input 
    //             requestedData.name = req.body.name;
    //             requestedData.color = req.body.color;
    //             // If Error send, else save requested data
    //             requestedData.save(function(err) {
    //                 !!err ? res.send(err) : res.send({
    //                     message: "Updated Data",
    //                     id: req.params.id
    //                 });
    //             });
    //         })
    //     })
    //     // Define the DELETE HTTP Verb Actions
    //     .delete(function(req, res) {
    //         // Find the Data Object Equal to the
    //         // ID from the req.params object
    //         GameModel.remove({
    //             _id: req.params.id
    //         }, function(err, requestedData) {
    //             // If Error send, else delete requested data
    //             !!err ? res.send(err) : res.json({
    //                 message: "Deleted Data",
    //                 id: req.params.id
    //             });
    //         });

    //     });
    // 
    



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