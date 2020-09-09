import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import UserController from './app/controllers/UserController';

import authVerification from './middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/login', SessionController.store);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/register_user', UserController.store);

routes.get('/products', (req, res) => {
    return res.json({});
});

routes.use(authVerification);

// todas as rotas abaixo precisam da que o usuário mande o token para funcionar
routes.get('/userInfo', UserController.index);

export default routes;
