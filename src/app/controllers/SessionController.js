import jwt from 'jsonwebtoken';

import bcrypt from 'bcryptjs';
import User from '../models/User';
import siga from '../../services/api';
import authConfig from '../../config/auth';

class SessionController {
    async store(req, res) {
        const { cpf, password } = req.body;

        const findUser = await User.findOne({ cpf })
            .populate('avatar')
            .catch(() => console.log('Usuário não cadastrado'));

        if (findUser) {
            const { password_hash } = findUser;
            if (findUser.password_hash) {
                const validPassword = await bcrypt.compareSync(
                    password,
                    password_hash
                );
                if (validPassword) {
                    return res.json({
                        token: jwt.sign({ id: cpf }, process.env.AUTH_SECRET, {
                            expiresIn: authConfig.expiresIn,
                        }),
                        _id: findUser.id,
                        name: findUser.name,
                        cpf: findUser.cpf,
                        email: findUser.email,
                        avatar: findUser.avatar,
                    });
                }
                return res
                    .status(401)
                    .json({ error: 'Usuário ou senha inválidos' });
            }
        }

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
                cpf: auth.data.documento,
                nome: auth.data.nome,
                email: auth.data.email,
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
