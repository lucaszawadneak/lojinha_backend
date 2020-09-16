import http from 'http';
import app from '../app';

const server = http.Server(app).listen(3334, () => {
    console.log('[socket] rodando servidor socket.io na porta 3334');
});

export default server;
