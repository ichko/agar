class ClientGame {

    constructor(socket, renderer, ioEvents, endpoints) {
        this.endpoints = endpoints;
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
        this.socket.on(this.endpoints.gameUpdate, gameData => {
            this.gameData = gameData;

            if (this.gameData.players[this.player.id]) {
                this.player.pos = this.gameData.players[this.player.id].pos;
                delete this.gameData.players[this.player.id];
            }
        });

        this.socket.on(this.endpoints.getPlayerId, player => {
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
            this.socket.emit(this.endpoints.broadcast, { id: this.player.id, input: this.player.input });
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