import jwt from 'jsonwebtoken';

import User from '../models/User';
import siga from '../../services/api';
import authConfig from '../../config/auth';

class SessionController {
    async store(req, res) {
        const { cpf, password } = req.body;

        const auth = await siga
            .post(process.env.SIGA_URL, {
                cpf,
                senha: password,
                token: process.env.SIGA_TOKEN,
            })
            .catch((err) => console.log(err));

        if (!auth) {
            return res
                .status(400)
                .json({ error: 'Occoreu um erro com a sua autenticação' });
        }

        const { status, data } = auth;
        const { documento, nome } = data;

        if (status === 200) {
            const findOne = await User.findOne({ cpf: documento });
            if (!findOne) {
                const user = new User({
                    name: nome,
                    cpf: documento,
                });
                user.save();
            }
            return res.json({
                ...auth.data,
                token: jwt.sign({ id: documento }, process.env.AUTH_SECRET, {
                    expiresIn: authConfig.expiresIn,
                }),
            });
        }
        return res
            .status(400)
            .json({ error: 'Occoreu um erro com a sua autenticação' });
    }
}

export default new SessionController();
