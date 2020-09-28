/* eslint-disable eqeqeq */
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
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Informações inválidas' });
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
        const { category, title } = req.query;

        let query = {
            title: {
                $regex: title || '',
                $options: 'i',
            },
        };

        if (category) {
            query = {
                category,
                title: {
                    $regex: title || '',
                    $options: 'i',
                },
            };
        }

        const products = await Product.find(query)
            .populate('picture')
            .populate({ path: 'user', select: '-password_hash' })
            .select('-password_hash')
            .catch(() => console.log('Produto não encontrado'));
        return res.json(products);
    }

    async delete(req, res) {
        const { id } = req.params;
        const { id: user_id } = req.body;

        const findProduct = await Product.findById(id).catch(() =>
            console.log('Produto não encontrado!')
        );

        if (!findProduct) {
            return res.status(400).json({ error: 'Produto não encontrado!' });
        }

        if (findProduct.user != user_id) {
            return res
                .status(401)
                .json({ error: 'Você não pode deletar esse produto!' });
        }

        await Product.deleteOne({ _id: id }).catch(() =>
            console.log('Erro ao deletar')
        );

        return res.json({ message: 'Ok!' });
    }
}

export default new ProductController();
