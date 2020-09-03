import { Router } from 'express';

import data from './database';
import siga from './services/api';

const routes = new Router();

routes.post('/login', async (req, res) => {
    const auth = await siga
        .post(
            'https://siga.ufpr.br:8380/siga/autenticacaoterceiros/discente/graduacao/',
            {
                cpf: process.env.TEST_CPF,
                senha: process.env.TEST_PASSWORD,
                token: process.env.SIGA_TOKEN,
            }
        )
        .catch((err) => console.log(err));

    return res.json({ ...auth.data });
});

routes.get('/products', (req, res) => {
    return res.json(data);
});

export default routes;
