import { Router } from 'express';

import data from './database';
// import axios from 'axios';

const routes = new Router();

routes.post('/login', async (req, res) => {
    // const auth = await axios
    //     .post(
    //         'https://siga.ufpr.br:8380/siga/autenticacaoterceiros/discente/graduacao',
    //         { cpf: '', senha: '1', token: process.env.SIGA_TOKEN }
    //     )
    //     .then((response) => console.log(response))
    //     .catch((err) => console.log(err));

    //     return res.json({...auth})

    return res.json({
        name: 'Lucas Cassilha',
        id: 0,
    });
});

routes.get('/products', (req, res) => {
    return res.json(data);
});

export default routes;
