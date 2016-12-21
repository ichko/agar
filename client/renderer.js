class Renderer {

    constructor(ctx, width = 500, height = 500) {
        this.width = width;
        this.height = height;
        this.ctx = ctx;
    }

    render(players, player, foods) {
        this.renderGrid(player.position);
        for (let id in players) {
            this.renderPlayer(players[id], player.position);
        }
        foods.forEach(food => this.renderPlayer(food, player.position, false));

        this.renderPlayer(player, player.position);
    }

    renderGrid(center) {
        let gridSize = 1;
        let padding = 100;
        center = { x: center.x % padding, y: center.y % padding };

        this.ctx.fillStyle = '#ccc';
        for(let x = -this.width / 2 - center.x;x < this.width / 2;x += padding) {
            this.ctx.fillRect(x, -this.height / 2, gridSize, this.height);
        }
        for(let y = -this.height / 2 + center.y;y < this.height / 2;y += padding) {
            this.ctx.fillRect(-this.width / 2, y, this.width, gridSize);
        }
    }

    renderPlayer(player, center, renderText = true) {
        if (player.position.x - center.x - player.size > this.width / 2 || player.position.x - center.x + player.size < -this.width / 2 ||
            player.position.y - center.y - player.size > this.height / 2 || player.position.y - center.y + player.size < -this.height / 2) {
            return;
        }

        let text = '';
        if (renderText) {
            text = player.name + ' [' + parseInt(player.size * 10) +
            '], [' + (player.position.x / 350).toFixed(1) + ', ' + (player.position.y / 350).toFixed(1) + ']';
        }

        this.ctx.beginPath();
        this.ctx.fillStyle = player.color;
        this.ctx.arc(player.position.x - center.x, -player.position.y + center.y, player.size, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(0,0,0,.1)';
        this.ctx.lineWidth = 4;
        this.ctx.arc(player.position.x - center.x, -player.position.y + center.y, player.size - 2, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.fillStyle = 'rgba(0,0,0,.6)';
        this.ctx.font = "bold 12pt Arial";
        var textData = this.ctx.measureText(text);
        this.ctx.fillText(text, player.position.x - center.x - textData.width / 2,
            -player.position.y + center.y - player.size - 5);
    }

    clear() {
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    }

}