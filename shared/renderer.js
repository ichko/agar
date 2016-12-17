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