window.onload = () => {

    let canvas = document.getElementById('canvas');
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    let ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);

    let renderer = new Renderer(ctx, canvas.width, canvas.height);
    let socket = io.connect(window.location.href);

    function modal(type, message) {
        alert(type + ': ' + message);
    }

    function initGameUi() {
        $('.form').hide();
        $('.game').show();
    }

    $('#registration, #login').submit(function (e) {
        e.preventDefault();
        let user = {
            username: $(this).find('.username').val(),
            password: $(this).find('.password').val()
        };

        socket.emit(`request.${ $(this).attr('id') }`, user);
    });

    socket.on('register.error', ({ message }) => modal('Error', message));
    socket.on('register.success', ({ message }) => modal('Success', message));
    socket.on('login.error', ({ message }) => modal('Error', message));

    socket.on('login.success', ({ id, data }) => {
        initGameUi();
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
