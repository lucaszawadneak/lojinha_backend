import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import UserController from './app/controllers/UserController';
import ProductController from './app/controllers/ProductController';
import ChatController from './app/controllers/ChatController';

import authVerification from './middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/login', SessionController.store);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/user', UserController.store);

routes.use(authVerification);

// todas as rotas abaixo precisam da que o usuário mande um token válido para funcionar

routes.get('/user/:id', UserController.index);

routes.delete('/user/:id', UserController.delete);

routes.put('/user/:id', UserController.update);

routes.post('/product', ProductController.store);

routes.get('/product/:id', ProductController.show);

routes.get('/products', ProductController.index);

routes.delete('/product/:id', ProductController.delete);

routes.post('/chat', ChatController.initialize);

routes.put('/chat', ChatController.store);

routes.get('/chat/:id/:user', ChatController.show);

routes.get('/chats/:user', ChatController.index);

export default routes;
