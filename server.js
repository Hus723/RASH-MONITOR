const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the "public" folder
app.use(express.static('public'));

// Handle incoming data from ESP32
app.use(express.json());
app.post('/data', (req, res) => {
    const data = req.body;
    console.log("Received data:", data);

    // Broadcast data to all connected clients
    io.emit('data', data);
    res.sendStatus(200);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});