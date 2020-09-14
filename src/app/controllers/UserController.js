import * as Yup from 'yup';
import bcrypt from 'bcryptjs';

import User from '../models/User';
import File from '../models/File';

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

        const findEmail = await User.findOne({ email }).catch(() =>
            console.log('Email não encontrado!')
        );

        if (findEmail) {
            return res.status(401).json({ error: 'Email já em uso' });
        }

        const findCPF = await User.findOne({ cpf }).catch(() =>
            console.log('CPF não encontrado!')
        );

        if (findCPF) {
            return res.status(401).json({ error: 'CPF já em uso' });
        }

        await File.findById(avatar_id).catch(() =>
            console.log('Imagem não encontradaa!')
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
        const { id } = req.params;

        if (!id) {
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

    async update(req, res) {
        const { id } = req.params;
        const {
            avatar_id,
            name,
            email,
            cpf,
            oldPassword,
            newPassword,
        } = req.body;

        const schema = Yup.object().shape({
            name: Yup.string(),
            cpf: Yup.string(),
            email: Yup.string(),
            oldPassword: Yup.string(),
            newPassword: Yup.string().when('$oldPassword', {
                is: true,
                then: (s) => s.required(),
            }),
            avatar_id: Yup.string().nullable(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Informações inválidas' });
        }

        const findOne = await User.findById(id).catch(() =>
            console.log('Usuário não encontrado!')
        );

        if (!findOne) {
            return res.status(400).json({ error: 'Usuário não encontrado!' });
        }
        await File.findById(avatar_id).catch(() =>
            console.log('Imagem não encontradaa!')
        );

        if (email) {
            const emailSearch = await User.findOne({ email }).catch(() =>
                console.log('Email não encontrado')
            );
            if (emailSearch) {
                return res.status(400).json({ error: 'Email já em uso' });
            }
        }

        if (newPassword) {
            const matchPassword = await bcrypt.compareSync(
                oldPassword,
                findOne.password_hash
            );

            if (!matchPassword) {
                return res.status(401).json({ error: 'Senha inválida!' });
            }

            const salt = await bcrypt.genSalt(10);
            const password_hash = bcrypt.hashSync(newPassword, salt);

            findOne.password_hash = password_hash;
        }

        if (name) {
            findOne.name = name;
        }
        if (cpf) {
            findOne.cpf = cpf;
        }
        findOne.save();

        return res.json({ message: 'Ok!' });
    }

    async delete(req, res) {
        const { id } = req.params;

        await User.findByIdAndDelete(id);

        return res.json({ message: 'Ok!' });
    }
}

export default new UserController();
