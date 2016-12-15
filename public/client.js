class IOEvents {

    constructor() {
        this.downKeysBindings = {};
        this.upKeysBindings = {};
        this.downAnyHandler = undefined;
        this.setupListeners();
    }

    downAny(handler) {
        this.downAnyHandler = handler;
    }

    down(key, handler) {
        this.downKeysBindings[key] = { down: false, handler };
        return this;
    }

    up(key, handler) {
        this.upKeysBindings[key] = { down: true, handler };
        return this;
    }

    trigger() {
        let down = false;
        for (let name in this.downKeysBindings) {
            if (this.downKeysBindings[name].down) {
                this.downKeysBindings[name].handler();
                down = true;
            }

            if (this.upKeysBindings[name].down) {
                this.upKeysBindings[name].handler();
            }
        }

        if (this.downAnyHandler && down) {
            this.downAnyHandler();
        }
    }

    setupListeners() {
        window.addEventListener('keydown', ({ key }) => {
            if(this.downKeysBindings[key]) {
                this.downKeysBindings[key].down = true;
            }
            if(this.upKeysBindings[key]) {
                this.upKeysBindings[key].down = false;
            }
        });

        window.addEventListener('keyup', ({ key }) => {
            if(this.downKeysBindings[key]) {
                this.downKeysBindings[key].down = false;
            }
            if(this.upKeysBindings[key]) {
                this.upKeysBindings[key].down = true;
            }
        });
    }

}

class Renderer {

    constructor(ctx, width = 500, height = 500) {
        this.width = width;
        this.height = height;
        this.ctx = ctx;
    }

    render(players, player) {
        for (let id in players) {
            this.renderPlayer(players[id], player.pos);
        }

        this.renderPlayer(player, player.pos);
    }

    renderPlayer(player, center) {
        this.ctx.beginPath();
        this.ctx.fillStyle = player.color;
        this.ctx.arc(player.pos.x - center.x, -player.pos.y + center.y, player.size, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
    }

    clear() {
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    }

}

class ClientGame {

    constructor(socket, renderer, ioEvents, room) {
        this.room = room;
        this.socket = socket;
        this.player = undefined;
        this.renderer = renderer;
        this.ioEvents = ioEvents;
        this.gameData = { players: {} };
    }

    startRenderLoop() {
        window.requestAnimationFrame();
    }

    setupServerUpdate() {
        this.socket.on(this.room.gameUpdate, gameData => {
            this.gameData = gameData;

            if (this.gameData.players[this.player.id]) {
                this.player.pos = this.gameData.players[this.player.id].pos;
                delete this.gameData.players[this.player.id];
            }
        });

        this.socket.on(this.room.getPlayerId, player => {
            this.player = new Player('name', this.ioEvents);
            this.player.size = player.size;
            this.player.color = player.color;
            this.player.id = player.id;
            this.player.init();
            this.setupPlayerBroadcast();
        });
    }

    setupPlayerBroadcast() {
        this.player.onChange = () => {
            this.socket.emit(this.room.broadcast, { id: this.player.id, input: this.player.input });
        };
    }

    start() {
        let self = this;
        this.setupServerUpdate();

        (function animate() {
            if (self.player != undefined) {
                self.renderer.clear();
                self.renderer.render(self.gameData.players, self.player);
                self.ioEvents.trigger();
                self.player.onChange();
            }

            requestAnimationFrame(animate);
        })();
    }

}

window.onload = () => {

    let canvas = document.getElementById('canvas');
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    let ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);

    let socket = io.connect();
    let ioEvents = new IOEvents();
    let renderer = new Renderer(ctx, canvas.width, canvas.height);
    game = new ClientGame(socket, renderer, ioEvents, room);

    game.start();

};
