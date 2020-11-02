import socketIO from 'socket.io';
import http from 'http';

import app from '../app';

const socketServer = http.createServer(app);

const io = socketIO(socketServer);

io.on('connection', (socket) => {
    socket.on('join_room', (room) => {
        socket.join(room);
    });

    socket.on('message', (data) => {
        socket.to(data.room).emit('receivedMessage', {
            message: data.message,
            sent_by: data.sent_by,
        });
    });

    socket.on('disconnect', () => {
        socket.disconnect();
    });
});

export default socketServer;
