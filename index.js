// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));


const Player = require('./server/serverPlayer.js');
const positions = require('./server/serverPositions.js');
const enemyPaths = require('./server/enemyPaths.js');
const game = require('./server/serverGame.js');
const Board = require('./server/serverBoard.js');
const board = new Board(positions); //annat namn?

enemy = new Player.Evil('enemy', enemyPaths[0]);
game.addPlayer(enemy);

io.on('connection', (socket) => {
    socket.player = new Player.Good(1, positions[1], positions[12], positions[13]); //id, home, key, goal
    game.addPlayer(socket.player);
    console.log(game.players);
    

    socket.emit('init', {
        id: socket.player.id,
        home: socket.player.home,
        key: socket.player.key,
        goal: socket.player.goal,
    });

    //wait until all players has joined

    io.sockets.emit('update board', {
        players: game.getVisibilityPlayers(),
        tokens: game.getTokens(),
        enemyPath: [],
        reachablePaths: [[]],
    }); 

    // const startNextTurn = () => {
    //     io.sockets.emit('players turn', { paths }); //skicka reachables walk etc, based on if caught
    // };
    // startNextTurn();

    // socket.on('player move', ({ path, pace }) => {
    //     console.log(path, pace);
    //     //socket.player.updatePosition();
    //     //socket.player.checkTarget();
    //     //socket.emit('update player', { data }); data: key/goalstatus, visible etc)

    //     //wait until all players has joined
    //     io.sockets.emit('update board', { players, tokens });
    //     socket.emit('enemy turn', { path }); //based on standard/free

    // });

    // socket.on('enemy step', ({ position, pace }) => {
    //     //socket.player.updatePosition();
    //     //socket.player.checkTarget();
    //     io.sockets.emit('update board', { players, tokens }); //in players: seen, caught
    // });

    // socket.on('enemy move completed', () => {
    //     startNextTurn();
    // });
});