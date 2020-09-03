import { Router } from 'express';

import data from './database';
import siga from './services/api';

const routes = new Router();

routes.post('/login', async (req, res) => {
    const { cpf, password } = req.params;

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

    if (auth.status === 200) {
        return res.json({ ...auth.data });
    }
    return res
        .status(auth.status)
        .json({ error: 'Occoreu um erro com a sua autenticação' });
});

routes.get('/products', (req, res) => {
    return res.json(data);
});

export default routes;
