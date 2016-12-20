let express = require('express');
let http = require('http');
let io = require('socket.io');
let init = require('./server/init');

let app = express();
let server = http.createServer(app);

app.use(express.static('./client'));
io = io.listen(server);

server.listen(process.env.PORT || 8888);
console.log('Server running...');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

init(io);
