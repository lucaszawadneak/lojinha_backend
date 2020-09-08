import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import path from 'path';
import routes from './routes';
import log from './middlewares/log';

dotenv.config();

class App {
    constructor() {
        this.server = express();

        this.middlewares();
        this.routes();
        this.mongo();
    }

    middlewares() {
        this.server.use(express.json());

        this.server.use(log);

        this.server.use(
            '/files',
            express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
        );
    }

    routes() {
        this.server.use(routes);
    }

    mongo() {
        this.connect = mongoose.connect(process.env.API_URL, {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true,
        });
    }
}

export default new App().server;
