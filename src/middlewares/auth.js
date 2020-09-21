import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res
            .status(401)
            .json({ error: 'Token inválido ou inexistente!' });
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = await promisify(jwt.verify)(
            token,
            process.env.AUTH_SECRET
        );

        if (decoded) {
            console.log('User Authenticated!');
        }

        return next();
    } catch (error) {
        console.log('Token inválido ou inexistente!');
        return res
            .status(401)
            .json({ error: 'Token inválido ou inexistente!' });
    }
};
