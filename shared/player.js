class Player {

    constructor(name) {
        this.id = undefined;
        this.pos = {x: 0, y: 0};
        this.size = Math.random() * 50 + 20;

        let colors = ['#44B3C2', '#F1A94E', '#E45641', '#5D4C46', '#FFD034', '#FF4C3B', '#0072BB'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.input = { up: false, down: false, left: false, right: false };

        this.name = name || '';
        this.onChange = (() => {});
    }

}

var module = module || { exports: {} };
module.exports = Player;
