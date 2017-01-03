let { Vector } = require('../shared/vector');
let { Player, randomColor } = require('../shared/player');


module.exports.Game = class {

    constructor(width = 6000, height = 6000) {
        this.players = { };
        this.size = { width, height };

        this.foods = [];
        this.foodsSize = 300;

        this.degradationRate = 0.01;
        this.playerMinSize = 10;
        this.playerMaxSize = 400;
    }

    generateFood() {
        for (let i = 0;i < this.foodsSize - this.foods.length;i++) {
            this.foods.push({
                position: {
                    x: Math.random() * this.size.width - this.size.width / 2,
                    y: Math.random() * this.size.height - this.size.height / 2
                },
                size: 10,
                color: randomColor()
            });
        }
    }

    numberOfPlayers() {
        let cnt = 0;
        for (let name in this.players) {
            cnt++;
        }

        return cnt;
    }

    getBroadcastData() {
        return {
            players: this.players,
            foods: this.foods
        };
    }

    getPlayer(id) {
        return this.players[id];
    }

    newPlayer(id, name) {
        this.playersCnt++;
        this.players[id] = new Player({
            id, name,
            position: new Vector(
                Math.random() * this.size.width - this.size.width / 2,
                Math.random() * this.size.height - this.size.height / 2
            )
        });
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
            this.players[id].velocity.clamp(lerp * 6 + 3);
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

    resolveFoodCollisions() {
        for (let name in this.players) {
            let player = this.players[name];

            this.foods.forEach((food, id) => {
                let dist = player.position.distance(food.position);
                if (dist < player.size + food.size) {
                    player.size += food.size / 5;
                    this.foods.splice(id, 1);
                }
            });
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
        this.generateFood();
        this.updatePlayersPositions();
        this.resolveCollisions();
        this.resolveFoodCollisions();

        for (let name in this.players) {
            if (this.players[name].size > this.playerMinSize) {
                this.players[name].size -= this.degradationRate;
            }

            if (this.players[name].size > this.playerMaxSize) {
                this.players[name].size = this.playerMaxSize;
            }
            if (this.players[name].size < this.playerMinSize) {
                this.players[name].size = this.playerMinSize;
            }
        }
    }

}