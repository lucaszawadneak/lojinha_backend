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
            picture: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Informações inválidas' });
        }

        const product = new Product(req.body);
        product.save();
        return res.json(product);
    }

    async index(req, res) {
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

    async show(req, res) {
        const products = await Product.find()
            .populate('picture')
            .populate({ path: 'user', select: '-password_hash' })
            .select('-password_hash')
            .catch(() => console.log('Produto não encontrado'));
        return res.json(products);
    }
}

export default new ProductController();
