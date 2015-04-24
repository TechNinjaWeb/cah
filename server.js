var PORT = process.env.PORT || 4000,
    express = require('express'),
    path = require('path'),
    app = express(),
    compression = require('compression'),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    sio = io.listen(server, {
        log: true,
        origins: '*:*'
    })

io.set('transports', ['websocket', 
    'flashsocket', 
    'htmlfile', 
    'xhr-polling', 
    'jsonp-polling', 
    'polling'
]);


app.set('views', __dirname + '/public/template');
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
app.set('views', path.join(__dirname, 'public/template'));

app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules'));
app.use('/scripts', express.static(__dirname + '/bower_components'));

var userList = {},
    roomsList = {};
roomsList.default = 'NinjaLounge';
roomsList[roomsList.default] = roomsList.default;

io.on('connection', function(socket) {
    // console.log("USER CONNECTED:",socket);
   
    socket.on('new-channel', function(data) {
        console.log("NEW-CHANNEL DATA", data);
        if (!roomsList[data.channel]) {
            initiatorChannel = data.channel;
        }
        console.log("SERVER DATA", data)
        roomsList[data.channel] = data.channel;
        onNewNamespace(data.channel, data.sender);
    });


    function onNewNamespace(channel, sender) {
        console.log("ONNEWNAMESPACE -- Client Calling for new channel, channel & sender", channel, sender)
        io.of('/' + channel).on('connection', function(socket) {
            var username;
            if (io.isConnected) {
                io.isConnected = false;
                socket.emit('connect', true);
                console.log("User Is Now Connected To: ")
            } else console.log("User Not Connected Socket: ", socket)

            socket.on('message', function(data) {
                console.log("Message Event - With Data: ", data)
                if (data.sender == sender) {
                    if (!username) username = data.data.sender;

                    socket.broadcast.emit('message', data.data);
                }
            });

            socket.on('disconnect', function() {
                if (username) {
                    socket.broadcast.emit('user-left', username);
                    username = null;
                }
            });
        });
    }

    // TECHNINJA IO CODE
    socket.join('NinjaLounge');

    var handshake, address,
        headers, host, origin;

    user = {},
        user.username = [];
        user.handshake = socket.handshake,
        user.address = socket.handshake.address,
        user.host = socket.handshake.headers.host,
        user.origin = socket.handshake.headers.origin,
        user.rooms = socket.rooms;

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
            user.rooms + "\n");
    }, 5000);

    socket.emit('server', {
        message: "You've been connected to Rahims MacbookPro"
    });

    socket.on('adduser', function(userName) {
        // Add user to master list
        userList[userName] = userName;
        console.log(userList['Rahim\'s Macbook'], "Users List");
        socket.emit("server", "We've Added You: " + userName);
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
        console.log("Sending rooms & users list to:", user.rooms[0]);
        socket.emit('getAll', {
            'rooms': roomsList,
            'usersOnline': userList
        })
    });
    // List Rooms
    socket.on('sendRooms', function(data) {
        console.log("Sending rooms list to:", user.rooms[0]);
        socket.emit('getRooms', {
            'rooms': roomsList
        })
    });
    // List Users
    socket.on('sendUsers', function(data) {
        console.log("Sending Users list to:", user.rooms[0]);
        socket.emit('getUsers', {
            'rooms': userList
        })
    });
    // Create A Room
    socket.on('createRoom', function(room) {
        rooms.push(room);
        socket.emit('updaterooms', rooms, socket.room);
        console.log('Update All Users with New Rooms', rooms, socket.room);
    });

    // Switch Rooms
    socket.on('switchRoom', function(newroom) {
        var oldroom;
        oldroom = socket.room;
        socket.leave(socket.room);
        socket.join(newroom);
        socket.emit('updatechat', 'you have connected to ' + newroom);
        socket.broadcast.to(oldroom).emit('updatechat', socket.username + ' has left this room');
        socket.room = newroom;
        socket.broadcast.to(newroom).emit('updatechat', socket.username + ' has joined this room');
        socket.emit('updaterooms', rooms, newroom);
    });

    socket.on('privateMessage', function(username, message) {
        socket.broadcast.to(username).emit(message);
        console.log("Private Message to: " + username);
    });

    socket.on('disconnect', function(channel) {
        console.log("User Left", channel);
        socket.disconnect();
        // if (initiatorChannel) {
        //     delete roomsList[initiatorChannel];
        // }
    });
});

app.get('/*', function(req, res, next) {
    res.render('index.html', {
        controller: 'AppCtrl'
    });
});

server.listen(PORT, function() {
    console.log("Socket & Express Server Started on port %d in %s mode", this.address().port, app.settings.env)
});