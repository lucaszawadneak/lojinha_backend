import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

import routes from './routes';
import log from './middlewares/log';

import NotificationController from './app/controllers/NotificationController';

dotenv.config();

class App {
    constructor() {
        this.app = express();

        this.middlewares();
        this.routes();
        this.mongo();
        this.notificationChunks();
    }

    middlewares() {
        this.app.use(express.json());

        this.app.use(log);

        this.app.use(
            '/files',
            express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
        );
    }

    routes() {
        this.app.use(routes);
    }

    async notificationChunks() {
        setInterval(async () => {
            console.log('Sending notifications!');
            await NotificationController.sendChunk();
        }, 60000);
    }

    mongo() {
        this.connect = mongoose.connect(process.env.API_URL, {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true,
        });
    }
}

export default new App().app;
