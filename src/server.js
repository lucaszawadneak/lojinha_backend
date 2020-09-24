import app from './app';
import socketServer from './config/chat';

app.listen(3333);

socketServer.listen(3434, () =>
    console.log('\x1b[36m[socket.io] socket running on port 3434')
);
