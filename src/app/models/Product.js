import mongoose from 'mongoose';

const Scheme = mongoose.Schema;

// INCOMPLETO
// FALTAM MÉTODOS DE PAGAMENTO E ENTREGA

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
});

const model = mongoose.model('Product', productSchema);

export default model;
