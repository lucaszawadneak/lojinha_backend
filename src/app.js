import express from 'express';
import dotenv from 'dotenv';

import routes from './routes';
import log from './middlewares/log';

dotenv.config();
class App {
    constructor() {
        this.server = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json());

        this.server.use(log);
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;
