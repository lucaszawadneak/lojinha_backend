import mongoose from 'mongoose';

const Scheme = mongoose.Schema;

const productSchema = new Scheme({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    deliveryDescription: {
        type: String,
        required: true,
    },
    paymentDescription: {
        type: String,
        required: true,
    },
    category: {
        type: Number,
        required: true,
    },
    picture: [
        {
            type: Scheme.Types.ObjectId,
            ref: 'File',
            required: true,
        },
    ],
    user: {
        type: Scheme.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    active: {
        type: Boolean,
        default: true,
    },
});

const model = mongoose.model('Product', productSchema);

export default model;
