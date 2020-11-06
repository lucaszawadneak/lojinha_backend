import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error:
                'Você não está logado. Por favor, faça login novamente para fazer isso!',
        });
    }

    const [, token] = authHeader.split(' ');

    try {
        await promisify(jwt.verify)(token, process.env.AUTH_SECRET);

        return next();
    } catch (error) {
        return res.status(401).json({
            error:
                'Você não está logado. Por favor, faça login novamente para fazer isso!',
        });
    }
};
