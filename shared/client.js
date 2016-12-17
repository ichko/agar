window.onload = () => {

    let canvas = document.getElementById('canvas');
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    let ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);

    let socket = io.connect();
    let ioEvents = new IOEvents();
    let renderer = new Renderer(ctx, canvas.width, canvas.height);
    game = new ClientGame(socket, renderer, ioEvents, endpoints);

    game.start();

};
