import { Router } from 'express';

import data from './database';

const routes = new Router();

routes.post('/login', (req, res) => {
    return res.json({
        name: 'Lucas Cassilha',
        id: 0,
    });
});

routes.get('/products', (req, res) => {
    return res.json({ ...data });
});

export default routes;
