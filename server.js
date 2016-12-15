let express = require('express');
let http = require('http');
let io = require('socket.io');
let config = require('./public/config.js');
var Player = require('./public/player.js');

let app = express();
let server = http.createServer(app);

app.use(express.static('public'));
io = io.listen(server);

server.listen(process.env.PORT || 3000);
console.log('Server running...');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


let idCnt = 0;
function getId() {
    return idCnt++;
}

let connections = {};
let players = {};
let online = 0;

io.sockets.on('connection', (socket) => {
    online++;
    let id = getId();
    connections[id] = socket;
    let player = new Player();
    player.id = id;
    players[id] = player;

    socket.emit(config.room.getPlayerId, players[id]);

    socket.on('disconnect', () => {
        console.log('Disconnected [%s]', online);

        online--;
        delete connections[id];
        delete players[id];
    });

    socket.on(config.room.broadcast, ({ id, input }) => {
        if (players[id]) {
            players[id].input  = input;
        }
    });

    console.log('New connection [%s]', online);
});

function updateGame() {
    for (let id in players) {
        let speed = 70 / players[id].size * 5;
        if (players[id].input.up)
            players[id].pos.y += speed;
        if (players[id].input.down)
            players[id].pos.y -= speed;
        if (players[id].input.left)
            players[id].pos.x -= speed;
        if (players[id].input.right)
            players[id].pos.x += speed;
    }
}

setInterval(() => {
    updateGame();
    io.sockets.emit(config.room.gameUpdate, { players });
}, 1000 / 30);
