let { Vector } = require('../shared/vector');
let { Player } = require('../shared/player');


module.exports.Game = class {

    constructor(width = 20000, height = 20000) {
        this.players = { };
        this.playersCnt = 0;
        this.size = { width, height };

        this.degradationRate = 0.01;
        this.playerMinSize = 10;
        this.playerMaxSize = 200;
    }

    numberOfPlayers() {
        return this.playersCnt;
    }

    getBroadcastData() {
        return {
            players: this.players
        };
    }

    getPlayer(id) {
        return this.players[id];
    }

    newPlayer(id, name) {
        this.playersCnt++;
        this.players[id] = new Player({ id, name });
    }

    deletePlayer(id) {
        this.playersCnt--;
        delete this.players[id];
    }

    updatePlayerVelocity(id, direction) {
        if (this.players[id]) {
            // direction = new Vector(direction.x, direction.y).lerp(1, 10, 350);
            direction = new Vector(direction.x, direction.y).scale(1 / 50);
            this.players[id].velocity.add(direction);

            let dSize = this.playerMaxSize - this.playerMinSize;
            let playerDSize = this.players[id].size - this.playerMinSize;
            let lerp = 1 - playerDSize / dSize;
            this.players[id].velocity.clamp(lerp * 4 + 2);
        }
    }

    resolveCollisions() {
        for (let nameA in this.players) {
            let playerA = this.players[nameA];

            for (let nameB in this.players) {
                if (nameA != nameB) {
                    let playerB = this.players[nameB];
                    let distance = playerA.position.distance(playerB.position);
                    if (playerA.size < this.playerMaxSize && playerB.size > this.playerMinSize &&
                        playerA.size > playerB.size && distance < playerA.size + playerB.size) {
                        let transfer = Math.min(playerB.size, playerA.size + playerB.size - distance) / 2;
                        this.players[nameA].size += transfer;
                        this.players[nameB].size -= transfer;
                    }
                }
            }
        }
    }

    updatePlayersPositions() {
        for (let name in this.players) {
            this.players[name].updatePosition();

            if (this.players[name].position.x > this.size.width / 2)
                this.players[name].position.x = this.size.width / 2;
            if (this.players[name].position.x < -this.size.width / 2)
                this.players[name].position.x = -this.size.width / 2;

            if (this.players[name].position.y > this.size.height / 2)
                this.players[name].position.y = this.size.height / 2;
            if (this.players[name].position.y < -this.size.height / 2)
                this.players[name].position.y = -this.size.height / 2;

        }
    }

    update() {
        for (let name in this.players) {
            if (this.players[name].size > this.playerMinSize) {
                this.players[name].size -= this.degradationRate;
            }
        }

        this.updatePlayersPositions();
        this.resolveCollisions();
    }

}