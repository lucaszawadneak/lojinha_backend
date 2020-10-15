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
        id: {
            type: String,
            default: mongoose.Types.ObjectId(),
        },
        content: {
            type: String,
            required: false,
        },
        date: {
            type: Date,
            required: false,
        },
        day: {
            type: String,
            required: false,
        },
        hour: {
            type: String,
            required: false,
        },
        sent_by: {
            type: String,
            required: false,
        },
        default: {},
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
