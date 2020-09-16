import socketIO from 'socket.io';
import socketServer from '../../config/socket';

const io = socketIO(socketServer);

io.on('connection', (socket) => {
    console.log('Usuário conectado ao chat');
});

io.on('disconnect', (socket) => {
    console.log('Usuário desconectou do chat');
});

export default io;
