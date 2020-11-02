import socketIO from 'socket.io';
import http from 'http';

import app from '../app';

const socketServer = http.createServer(app);

const io = socketIO(socketServer);

const onlineUsers = [];

io.on('connection', (socket) => {
    socket.on('online', (user) => {
        onlineUsers.push(user);
    });

    socket.on('join_room', (room) => {
        socket.join(room);
    });

    socket.on('message', (data) => {
        socket.to(data.room).emit('receivedMessage', {
            message: data.message,
            sent_by: data.sent_by,
        });
    });

    socket.on('disconnect', (user) => {
        const index = onlineUsers.findIndex(user);
        onlineUsers.splice(index, 1);
        socket.disconnect();
    });
});

export default socketServer;
