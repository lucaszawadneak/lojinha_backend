import { isPast, formatISO, isValid, addMinutes } from 'date-fns';
import nodemailer from 'nodemailer';

import User from '../models/User';

class VerificationController {
    async store(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Informações inválidas' });
        }
        const findUser = await User.findById(id).catch(() =>
            console.log('Usuário não encontrado!')
        );

        if (!findUser) {
            return res.status(400).json({ error: 'Usuário não encontrado!' });
        }

        if (!findUser.email) {
            return res
                .status(400)
                .json({ error: 'Usuário não cadastrou email!' });
        }

        if (findUser.mail_verification.isVerified) {
            return res
                .status(400)
                .json({ error: 'Usuário já verificou o email!' });
        }

        const currentDate = new Date();

        const expires_at = addMinutes(currentDate, 5);

        // GERA UM VALOR ALEATÓRIO ENTRE 100.000 E 990.000 E ADICIONA OS MILISEGUNDOS
        const code =
            Number(Math.floor(Math.random() * (990000 - 100000) + 100000)) +
            Number(currentDate.getMilliseconds());

        const data = { code, expires_at, isVerified: false };

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
                subject: 'Verificação de email app lojinha - UFPR',
                html: `<h1>Obrigado por se cadastrar no app lojinha da UFPR</h1>
                <p>Coloque o seguinte código no app:</p><strong>${code}</strong></br>`,
            })
            .then(() => {
                return res.json({ message: 'ok!' });
            })
            .catch((err) => res.json({ error: err }));

        return 0;
    }

    async update(req, res) {
        const { verificationCode, user } = req.body;

        if (!verificationCode || !user) {
            return res.status(400).json({ error: 'Informações inválidas!' });
        }

        const findUser = await User.findById(user);

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

        findUser.mail_verification.isVerified = true;
        findUser.save();

        return res.json({ message: 'ok!' });
    }
    // async update(req, res) {}
}

export default new VerificationController();
