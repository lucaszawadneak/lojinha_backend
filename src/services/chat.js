import socketIO from 'socket.io';
import http from 'http';

import app from '../app';

const socketServer = http.createServer(app);

const io = socketIO(socketServer);

export const onlineUsers = [];

io.on('connection', (socket) => {
    socket.on('join_room', (room) => {
        socket.join(room);
    });

    socket.on('online', (userID) => {
        const index = onlineUsers.findIndex((item) => item == userID);
        if (index < 0) {
            onlineUsers.push(userID);
        }

        console.log(onlineUsers);
    });

    socket.on('offline', (userID) => {
        console.log('user left!');
        const index = onlineUsers.findIndex((item) => item == userID);
        if (index >= 0) {
            onlineUsers.splice(index, 1);
        }
    });

    socket.on('message', (data) => {
        socket.to(data.room).emit('receivedMessage', {
            room: data.room,
            message: data.message,
            sent_by: data.sent_by,
        });
    });

    socket.on('disconnect', () => {
        socket.disconnect();
    });
});

export default socketServer;
