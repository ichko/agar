module.exports.Vector = class {

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;

        return this;
    }

    distance(vector) {
        let dx = this.x - vector.x;
        let dy = this.y - vector.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    scaleTo(size = 1) {
        let len = this.length();
        this.x = this.x / len * size;
        this.y = this.y / len * size;

        return this;
    }

    scale(size) {
        this.x = this.x * size;
        this.y = this.y * size;

        return this;
    }

    lerp(factor, min, max) {
        let len = this.length();

        let d = max - min;
        let dLen = len - min;

        if (dLen > d) {
            dLen = d;
        }

        let scale = dLen / d * factor;

        this.x = this.x / len * scale;
        this.y = this.y / len * scale;

        return this;
    }

    clamp(size) {
        let len = this.length();
        if (len > size) {
            this.x = this.x / len * size;
            this.y = this.y / len * size;
        }

        return this;
    }

    polar(magnitude = 1, direction = 0) {
        this.x = magnitude * Math.cos(direction);
        this.y = magnitude * Math.sin(direction);

        return this;
    }

}