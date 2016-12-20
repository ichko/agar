let { Game } = require('./game');

module.exports = function init(io) {

    let fps = 45;
    let getId = (() => {
        let id = 0;
        return () => id++;
    })();

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

        socket.on('update.player', (input) => {
            game.updatePlayerVelocity(id, input.direction);
        });

        socket.on('request.game', (data) => {
            game.newPlayer(id, data.name);
            socket.emit('start.game', { id, data: game.getBroadcastData() });
        });

        console.log('id %s connected, currently %s online players', id, game.numberOfPlayers());
    });

    function updateGame() {
        game.update();
    }

    setInterval(() => {

        updateGame();
        io.sockets.emit('update.game', game.getBroadcastData());

    }, 1000 / fps);

}