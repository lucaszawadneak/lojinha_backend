import * as Yup from 'yup';
import Product from '../models/Product';

class ProductController {
    async store(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string().required(),
            price: Yup.string().required(),
            description: Yup.string().required(),
            category: Yup.number().positive().required(),
            user: Yup.string().required(),
            picture: Yup.array().required(),
            deliveryDescription: Yup.string().required().max(250),
            paymentDescription: Yup.string().required().max(60),
        });

        if (!(await schema.isValid(req.body))) {
            return res
                .status(400)
                .json({ error: 'Informações inválidas ou faltando!' });
        }

        const product = new Product(req.body);
        product.save();
        return res.json(product);
    }

    async show(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(401).json({ error: 'Informações inválidas' });
        }

        const findOne = await Product.findById(id)
            .populate('picture')
            .populate({ path: 'user', select: '-password_hash' })
            .select('-password_hash')
            .catch(() => console.log('Produto não encontrado'));

        if (!findOne) {
            return res.status(401).json({ error: 'Produto não encontrado' });
        }

        return res.json(findOne);
    }

    async index(req, res) {
        const { category, title, page, user, onlyActive } = req.query;
        const { exclude } = req.body;

        const schema = Yup.object().shape({
            page: Yup.number().nullable(),
            category: Yup.number().min(0).nullable(),
            title: Yup.string().nullable(),
        });

        if (!(await schema.isValid(req.query)))
            return res.status(400).json({ error: 'Informações inválidas' });

        let currentPage = 0;

        if (page) {
            currentPage = Math.max(0, page);
        }

        let query = {
            title: {
                $regex: title || '',
                $options: 'i',
            },
        };

        if (onlyActive) {
            query = { ...query, active: true };
        }

        if (category) {
            query = { ...query, category };
        }
        if (user) {
            query = { ...query, user };
        }

        const products = await Product.find(query)
            .sort([['created_at', -1]])
            .skip(currentPage * 10)
            .limit(10)
            .populate('picture')
            .populate({ path: 'user', select: '-password_hash' })
            .select('-password_hash')
            .catch(() => console.log('Produto não encontrado'));

        if (exclude) {
            exclude.forEach((id) => {
                let index = products.findIndex((item) => item._id == id);
                console.log(id);
                if (index >= 0) {
                    products.splice(index, 1);
                }
            });
        }

        return res.json(products);
    }

    async update(req, res) {
        const { id, user } = req.params;

        const schema = Yup.object().shape({
            title: Yup.string().nullable(),
            price: Yup.string().nullable(),
            description: Yup.string().nullable(),
            category: Yup.number().positive().nullable(),
            picture: Yup.array().nullable(),
            deliveryDescription: Yup.string().nullable().max(250),
            paymentDescription: Yup.string().nullable().max(60),
            active: Yup.boolean().nullable(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Informações inválidas' });
        }

        const product = await Product.findById(id).catch(() =>
            console.log('Produto não encontrado')
        );

        if (!product) {
            return res.status(400).json({ error: 'Produto não encontrado' });
        }

        if (product.user != user) {
            return res
                .status(401)
                .json({ error: 'Você não tem permissão para editar isso!' });
        }

        console.log(req.body.category);

        await product.updateOne(req.body);
        product.save();

        return res.json({ message: 'ok' });
    }

    async delete(req, res) {
        const { id } = req.params;
        const { id: user_id } = req.body;

        const findProduct = await Product.findById(id).catch(() =>
            console.log('Produto não encontrado!')
        );

        if (!findProduct)
            return res.status(400).json({ error: 'Produto não encontrado!' });

        if (findProduct.user != user_id)
            return res
                .status(401)
                .json({ error: 'Você não pode deletar esse produto!' });

        await Product.deleteOne({ _id: id }).catch(() =>
            console.log('Erro ao deletar')
        );

        return res.json({ message: 'Ok!' });
    }
}

export default new ProductController();
