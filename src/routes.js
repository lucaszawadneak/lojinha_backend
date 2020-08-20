import { Router } from 'express';

import data from './database';

const routes = new Router();

routes.post('/login', (req, res) => {
    return res.json({
        name: 'Roberval',
        id: 1,
    });
});

routes.get('/products', (req, res) => {
    return res.json({ ...data });
});

export default routes;
