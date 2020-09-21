import mongoose from 'mongoose';

const Scheme = mongoose.Schema;

const chatSchena = new Scheme({
    buyer: {
        type: Scheme.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    seller: {
        type: Scheme.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: Scheme.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    last_message: {
        type: Date,
        default: Date.now,
    },
    messages: {
        type: Array,
        required: true,
    },
    messagesLength: {
        type: Number,
        default: 1,
    },
});

const model = mongoose.model('Chat', chatSchena);

export default model;
