import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import socketIO from 'socket.io';
import http from 'http';

import routes from './routes';
import log from './middlewares/log';

dotenv.config();

class App {
    constructor() {
        this.app = express();
        this.server = http.Server(this.app);

        this.socket();

        this.middlewares();
        this.routes();
        this.mongo();
    }

    middlewares() {
        this.app.use(express.json());

        this.app.use(log);

        this.app.use(
            '/files',
            express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
        );

        this.app.use((req, res, next) => {
            req.io = this.io;

            next();
        });
    }

    routes() {
        this.app.use(routes);
    }

    socket() {
        this.io = socketIO(this.server);

        this.io.on('connection', (socket) => {
            console.log(socket.id + ' - User connected!');

            socket.on('disconnect', () => {
                console.log(socket.id + ' - User disconnected!');
            });
        });
    }

    mongo() {
        this.connect = mongoose.connect(process.env.API_URL, {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true,
        });
    }
}

const newApp = new App().app;

export default newApp;
