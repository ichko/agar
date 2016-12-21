let { Vector } = require('./vector');

function randomColor() {
    let colors = ['0072BB', 'FF4C3B', 'FFD034', '0093D1', 'F2635F', 'F4D00C', '462066',
                  'FFB85F', 'FF7A5A', '00AAA0', '8ED2C9', 'FF7182', '004040', '00FF00'];
    return '#' + colors[Math.floor(Math.random() * colors.length)];
}
module.exports.randomColor = randomColor;

module.exports.Player = class {

    constructor({
        name = '<no_name>',
        id = -1,
        position = new Vector(),
        size = 20 + Math.random(),
        color = '#f00'
    }) {
        this.name = name;
        this.id = id;
        this.position = position;
        this.size = size;
        this.color = randomColor();
        this.velocity = new Vector();
    }

    updatePosition() {
        this.position.add(this.velocity);
    }

}
