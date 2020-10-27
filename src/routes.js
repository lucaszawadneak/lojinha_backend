import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import UserController from './app/controllers/UserController';
import ProductController from './app/controllers/ProductController';
import ChatController from './app/controllers/ChatController';
import VerificationController from './app/controllers/VerificationController';

import authVerification from './middlewares/auth';

import categories from './data/categories.json';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/login', SessionController.store);

routes.post('/files', upload.array('files', 5), FileController.store);

routes.post('/user', UserController.store);

routes.get('/categories', (_, res) => {
    return res.json(categories);
});

routes.get('/products', ProductController.index);

routes.get('/product/:id', ProductController.show);

routes.use(authVerification);

// todas as rotas abaixo precisam da que o usuário mande um token válido para funcionar

routes.get('/user/:id', UserController.index);

routes.delete('/user/:id', UserController.delete);

routes.put('/user/:id', UserController.update);

routes.post('/product', ProductController.store);

routes.put('/product/:id/:user', ProductController.update);

// recebe o id do produto e do usuário que quer editar

routes.delete('/product/:id', ProductController.delete);

routes.post('/chat', ChatController.store);
// cria uma sala de mensagens e registra no banco de dados

routes.put('/chat', ChatController.update);
// armazena mensagem enviada

routes.get('/chat/:id/:user', ChatController.show);

routes.get('/chats/:user', ChatController.index);

routes.post('/generate_code/:id', VerificationController.generate);

routes.post('/verify_code', VerificationController.verify);

export default routes;
