import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

import authVerification from './middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/login', SessionController.store);

routes.use(authVerification);

// todas as rotas abaixo precisam da que o usuário mande o token para funcionar

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/products', (req, res) => {
    return res.json({});
});

export default routes;
