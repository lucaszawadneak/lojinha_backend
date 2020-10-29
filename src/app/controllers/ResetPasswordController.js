import { isPast, formatISO, isValid, addMinutes, format } from 'date-fns';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

import User from '../models/User';

class ResetPasswordController {
    async store(req, res) {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Informações inválidas' });
        }
        const findUser = await User.findOne({ email }).catch(() =>
            console.log('Usuário não encontrado!')
        );

        if (!findUser) {
            return res.status(400).json({ error: 'Usuário não encontrado!' });
        }

        if (!findUser.password_hash) {
            return res.status(400).json({
                error:
                    'Sua conta está ligada ao SIGA! Para recuperar sua senha, faça o processo nessa plataforma.',
            });
        }

        const currentDate = new Date();

        const expires_at = addMinutes(currentDate, 5);

        // GERA UM VALOR ALEATÓRIO ENTRE 100.000 E 990.000 E ADICIONA OS MILISEGUNDOS
        const code =
            Number(Math.floor(Math.random() * (990000 - 100000) + 100000)) +
            Number(currentDate.getMilliseconds());

        // Utiliza o mesmo procedimento de verificação do email para recuperar a senha
        const data = {
            code,
            expires_at,
            isVerified: findUser.mail_verification.isVerified,
        };

        findUser.mail_verification = data;
        findUser.save();

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_ID,
            port: 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        transporter
            .sendMail({
                from: process.env.EMAIL_USER,
                to: findUser.email,
                subject: 'Recuperação de senha - Lojinha UFPR',
                html: `<h3>Você fez um pedido de recuperação de senha do app Lojinha.</h3>
                <p>Coloque o seguinte código no app:</p> <strong>${code}</strong></br>
                <span>Se você não fez esse pedido, apenas ignore.</span>`,
            })
            .then(() => {
                return res.json({ expires_at });
            })
            .catch((err) => res.json(err));

        return 0;
    }

    async update(req, res) {
        const { verificationCode, email, password } = req.body;

        if (!verificationCode || !password || !email) {
            return res.status(400).json({ error: 'Informações inválidas!' });
        }

        const findUser = await User.findOne({
            email,
        });

        if (!findUser) {
            return res.status(400).json({ error: 'Usuário não encontrado!' });
        }

        const userDateOBJ = findUser.mail_verification.expires_at;

        const isDateValid = isValid(userDateOBJ);

        const formattedDate = isDateValid
            ? userDateOBJ
            : formatISO(findUser.mail_verification.expires_at);

        if (isPast(formattedDate)) {
            return res.status(400).json({ error: 'O tempo do token expirou!' });
        }

        if (Number(verificationCode) !== findUser.mail_verification.code) {
            return res.status(400).json({ error: 'Código inválido!' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = bcrypt.hashSync(password, salt);

        findUser.password_hash = password_hash;
        findUser.save();

        return res.json({ message: 'ok!' });
    }
    // async update(req, res) {}
}

export default new ResetPasswordController();
