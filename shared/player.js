module.exports = class Player {

    constructor({
        user = '<no_name>',
        id = -1,
        position = new Vector(),
        size = 10,
        color = '#f00'
    }) {
        this.name = name;
        this.id = id;
        this.position = position;
        this.size = size;
        this.color = color;
        this.velocity = new Vector();
    }

    updatePosition() {
        this.position.add(this.velocity);
    }

}
