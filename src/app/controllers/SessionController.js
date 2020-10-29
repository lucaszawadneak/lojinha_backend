import jwt from 'jsonwebtoken';
import { Expo } from 'expo-server-sdk';

import bcrypt from 'bcryptjs';
import User from '../models/User';
import siga from '../../services/api';
import authConfig from '../../config/auth';

class SessionController {
    async store(req, res) {
        const { cpf, password, notificationToken } = req.body;

        const findUser = await User.findOne({ cpf })
            .populate('avatar')
            .catch(() => console.log('Usuário não cadastrado'));

        // PROCURA UM USUÁRIO COM CPF REGISTRADO NO BACK
        // SE NÃO ACHAR, OU SE O USUÁRIO NÃO POSSUIR SENHA REGISTRADA, FAZ O LOGIN PELO SIGA
        if (findUser) {
            if (
                !findUser.notification_token &&
                Expo.isExpoPushToken(notificationToken)
            ) {
                findUser.notification_token = notificationToken;
                findUser.save();
            }
            const { password_hash } = findUser;
            if (findUser.password_hash) {
                const validPassword = await bcrypt.compareSync(
                    password,
                    password_hash
                );
                if (validPassword) {
                    return res.json({
                        token: jwt.sign(
                            { id: findUser.id },
                            process.env.AUTH_SECRET,
                            {
                                expiresIn: authConfig.expiresIn,
                            }
                        ),
                        _id: findUser.id,
                        name: findUser.name,
                        cpf: findUser.cpf,
                        email: findUser.email,
                        avatar: findUser.avatar,
                        mail_verification:
                            findUser.mail_verification.isVerified,
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
            .catch((err) => console.log(err.response.data));

        if (!auth) {
            return res
                .status(401)
                .json({ error: 'Occoreu um erro com a sua autenticação' });
        }

        const { status, data } = auth;
        const { documento, nome, usuarioCategorias } = data;

        if (status === 200) {
            let user = await User.findOne({ cpf: documento });
            // SE O USUÁRIO NÃO FOR REGISTRADO NA BASE DE DADOS, ELE O FARÁ
            if (!user) {
                let isStudent = false;
                const studentType = usuarioCategorias[0].descricaoNivel.substring(
                    0,
                    8
                );
                if (studentType === 'Discente') {
                    isStudent = true;
                }

                // CORRIGE O NOME PARA PRIMEIRA LETRA DE CADA PALAVRA SER MAIUSCULÁ
                const nameInLowerCase = nome.toLowerCase().split(' ');
                let correctedName = [];
                nameInLowerCase.forEach((item) => {
                    correctedName.push(
                        item.charAt(0).toUpperCase() + item.substring(1)
                    );
                });

                correctedName = correctedName.join(' ');

                const notToken = Expo.isExpoPushToken(notificationToken)
                    ? notificationToken
                    : null;

                user = new User({
                    name: correctedName,
                    cpf: documento,
                    student: isStudent,
                    notification_token: notToken,
                });
                user.save();
            }
            return res.json({
                _id: user.id,
                avatar: user.avatar,
                student: user.student,
                siga_linked: true,
                cpf: user.cpf,
                name: user.name,
                email: user.email,
                token: jwt.sign({ id: user.id }, process.env.AUTH_SECRET, {
                    expiresIn: authConfig.expiresIn,
                }),
            });
        }
        return res
            .status(401)
            .json({ error: 'Occoreu um erro com a sua autenticação' });
    }
}

export default new SessionController();
