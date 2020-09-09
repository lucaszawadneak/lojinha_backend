import * as Yup from 'yup';
import bcrypt from 'bcryptjs';

import User from '../models/User';

class UserController {
    async store(req, res) {
        const { name, email, cpf, password, avatar_id } = req.body;

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            cpf: Yup.string().required(),
            email: Yup.string().required(),
            password: Yup.string().required(),
            avatar_id: Yup.string().nullable(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Informações inválidas' });
        }

        const findOne = await User.findOne({ cpf }).catch(() =>
            console.log('Usuário não encontrado')
        );
        if (findOne) {
            return res.status(400).json({ error: 'Usuário já registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = bcrypt.hashSync(password, salt);

        const user = new User({
            password_hash,
            name,
            email,
            cpf,
            avatar: avatar_id,
        });
        user.save();

        return res.json({ message: 'User registered!' });
    }

    async index(req, res) {
        const { id } = req.body;

        const schema = Yup.object().shape({
            id: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(401).json({ error: 'Informações inválidas' });
        }

        const findOne = await User.findById(id)
            .select('-password_hash')
            .populate('avatar')
            .catch(() => console.log('Usuário não encontrado'));

        if (!findOne) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        return res.json(findOne);
    }
}

export default new UserController();
