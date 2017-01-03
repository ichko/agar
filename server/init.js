var JsonDB = require('node-json-db');

let { Game } = require('./game');
let { UserRepository } = require('./userRepository');


module.exports = function init(io) {

    let fps = 45;
    let getId = (() => {
        let id = 0;
        return () => id++;
    })();

    var db = new JsonDB("database", true, true);
    let userRepository = new UserRepository(db);

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

        socket.on('request.login', (user) => {
            if (userRepository.userExists(user)) {
                game.newPlayer(id, user.username);
                socket.emit('login.success', { id, data: game.getBroadcastData() });
            } else {
                socket.emit('login.error', { message: 'User is not registered' });
            }
        });


        socket.on('request.registration', (user) => {
            if (userRepository.userExists(user)) {
                socket.emit('register.error', { message: 'User already registered' });
            } else {
                userRepository.addUser(user);
                socket.emit('register.success', { message: 'Successful registration' });
            }
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