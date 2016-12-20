let { Game } = require('./game');

module.exports = function gameInit(io) {

    let fps = 30;
    let getId = (() => {
        let id = 0;
        return () => id++;
    });

    let game = new Game();
    let connections = { };

    io.sockets.on('connection', (socket) => {

        let id = getId();
        connections[id] = socket;

        socket.on('disconnect', () => {
            console.log('id %s disconnected, currently %s online players', id, game.numberOfPlayers());

            delete connections[id];
            game.deletePlayer(id);
        });

        socket.on('update.player', ({ input }) => {
            game.updatePlayerVelocity(id, input.direction);
        });

        console.log('id %s connected, currently %s online players', id, game.numberOfPlayers());
    });

    function updateGame() {
        game.updatePlayersPositions();
    }

    setInterval(() => {

        updateGame();
        io.sockets.emit('update.game', game.getBroadcastData());

    }, 1000 / fps);

}