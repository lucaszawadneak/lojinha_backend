import mongoose from 'mongoose';
import * as Yup from 'yup';

import { format } from 'date-fns';

import Chat from '../models/Chat';
import User from '../models/User';
import Product from '../models/Product';

import NotificationController from './NotificationController';

// OBJETO MENSAGEM
// id: {
//     type: String,
//     default: mongoose.Types.ObjectId(),
// },
// content: {
//     type: String,
//     required: true,
// },
// date: {
//     type: Date,
//     required: true,
// },
// day: {
//     type: String,
//     required: true,
// },
// hour: {
//     type: String,
//     required: true,
// },
// sent_by: {
//     type: String,
//     required: true,
// },

class ChatController {
    async store(req, res) {
        const { user, product, seller } = req.body;

        if (user === seller) {
            return res
                .status(400)
                .json({ error: 'Você não pode comprar seu próprio produto' });
        }

        const findUser = await User.findById(user).catch(() =>
            console.log('Usuário não encontrado!')
        );

        if (!findUser) {
            return res.status(404).json({ error: 'Usuário não encontrado!' });
        }

        const findChat = await Chat.find({ buyer: user, product }).catch(() =>
            console.log('Chat não encontrado')
        );

        if (findChat[0]) {
            return res.status(400).json({ error: 'Chat já criado!' });
        }

        const matchProduct = await Product.find({
            user: seller,
            id: product,
        }).catch(() => console.log('Produto não encontrado!'));

        if (!matchProduct) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        const currentDate = new Date();

        const chat = new Chat({
            buyer: user,
            seller,
            product,
            messagesLength: 1,
            messages: [
                {
                    id: mongoose.Types.ObjectId(),
                    content:
                        'Para sua segurança, cuidado ao expor informações e dados pessoais.',
                    date: currentDate,
                    day: format(currentDate, 'dd/MM/yyyy'),
                    hour: format(currentDate, 'kk:mm'),
                    sent_by: 'chat',
                },
            ],
        });

        chat.save();

        return res.json(chat);
    }

    async update(req, res) {
        const { message, user, chat, sent_by } = req.body;

        const schema = Yup.object().shape({
            message: Yup.string().required(),
            sent_by: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Mensagem inválida!' });
        }

        const findChat = await Chat.findById(chat)
            .populate({ path: 'buyer', select: ['id', 'notification_token'] })
            .populate({ path: 'seller', select: ['id', 'notification_token'] })
            .catch(() => console.log('Chat não encontrado!'));

        if (!findChat) {
            return res.status(404).json({ error: 'Chat não encontrado!' });
        }

        if (findChat.buyer.id != user && findChat.seller.id != user) {
            return res
                .status(401)
                .json({ error: 'Você não pode acessar esse chat!' });
        }

        const currentDate = new Date();

        const messageObj = {
            id: mongoose.Types.ObjectId(),
            content: message,
            date: currentDate,
            day: format(currentDate, 'dd/MM/yyyy'),
            hour: format(currentDate, 'kk:mm'),
            sent_by,
        };

        findChat.messages.splice(0, 0, messageObj);
        findChat.messagesLenght += 1;

        findChat.last_message = messageObj;
        findChat.save();
        // salva a mensagem no banco de dados

        // NOTIFICAR USUÁRIO QUE RECEBE MENSAGEM
        let expoToken = null;

        if (sent_by === 'buyer') {
            expoToken = findChat.seller.notification_token;
        } else {
            expoToken = findChat.buyer.notification_token;
        }

        const notification = {
            expoToken,
            message,
        };

        NotificationController.requestSend(notification);

        return res.json({ message: 'Ok!' });
    }

    async show(req, res) {
        const { id, user } = req.params;

        const findChat = await Chat.findById(id)
            .populate({
                path: 'buyer',
                select: ['-password_hash', '-created-at'],
            })
            .populate({
                path: 'seller',
                select: ['-password_hash', '-created-at'],
            })
            .populate({
                path: 'product',
                select: ['-user', '-description', '-created-at'],
                populate: 'picture',
            })
            .catch(() => {
                console.log('Chat não encontrado!');
            });

        if (!findChat) {
            return res.status(404).json({ error: 'Chat não encontrado!' });
        }

        if (findChat.buyer.id != user && findChat.seller.id != user) {
            return res
                .status(401)
                .json({ error: 'Você não pode acessar esse chat!' });
        }

        return res.json(findChat);
    }

    async index(req, res) {
        const { user } = req.params;

        const chatData = await Chat.find({
            $or: [{ buyer: user }, { seller: user }],
        })
            .populate({
                path: 'buyer',
                select: ['-password_hash', '-created-at'],
            })
            .populate({
                path: 'seller',
                select: ['-password_hash', '-created-at'],
            })
            .populate({
                path: 'product',
                select: ['-user', '-description', '-created-at'],
                populate: 'picture',
            })
            .select('-messages')
            .catch(() => console.log('Usuário não possui chats!'));
        // Procura por chats onde o usuário é ou comprador ou vendedor ($or)

        if (!chatData) {
            return res.json();
        }
        return res.json(chatData);
    }
}

export default new ChatController();
