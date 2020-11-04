import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: 'Token inválido ou expirado! Faça login novamente.',
        });
    }

    const [, token] = authHeader.split(' ');

    try {
        await promisify(jwt.verify)(token, process.env.AUTH_SECRET);

        return next();
    } catch (error) {
        return res.status(401).json({
            error: 'Token inválido ou expirado! Faça login novamente.',
        });
    }
};
