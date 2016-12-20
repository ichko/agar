class Vector {

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;

        return this;
    }

    polar(magnitude = 1, direction = 0) {
        this.x = magnitude * Math.cos(direction);
        this.y = magnitude * Math.sin(direction);

        return thos;
    }

}