let { Player } = require('../shared/player');


module.exports.Game = class {

    constructor() {
        this.players = {};
        this.playersCnt = 0;
    }

    numberOfPlayers() {
        return this.playersCnt;
    }

    getBroadcastData() {
        return {
            players: this.players
        };
    }

    newPlayer(id, name) {
        this.playersCnt++;
        this.players[id] = new Player({ id, name });
        return this.newId();
    }

    deletePlayer(id) {
        this.playersCnt--;
        delete this.players[id];
    }

    updatePlayerVelocity(id, direction) {
        if (this.players[id]) {
            this.players[id].velocity.add(direction);
        }
    }

    updatePlayersPositions() {
        for (let name in this.players) {
            this.players[name].updatePosition();
        }
    }

}