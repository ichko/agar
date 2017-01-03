window.onload = () => {

    // let server = window.prompt('Server', 'http://78.90.132.183:8888/');
    let name = window.prompt('Name');

    //let server = 'http://78.90.132.183:8888/';
    //let name = 'Pesho';

    let canvas = document.getElementById('canvas');
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    let ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);

    let renderer = new Renderer(ctx, canvas.width, canvas.height);

    let socket = io.connect();

    socket.emit('request.game', { name });

    socket.on('start.game', ({ id, data }) => {
        let player = data.players[id];
        let foods = data.foods;

        socket.on('update.game', data => {
            players = data.players;
            player = data.players[id];
            foods = data.foods;

            delete players[id];
        });

        window.onmousemove = ({ x, y }) => socket.emit('update.player', {
            direction: {
                x: x - canvas.width / 2,
                y: -y + canvas.height / 2
            }
        });

        window.setInterval(() => {

            renderer.clear();
            renderer.render(players, player, foods);

        }, 1000 / 45);

    });

};
