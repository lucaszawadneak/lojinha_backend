import mongoose from 'mongoose';

const Scheme = mongoose.Schema;

const productSchema = new Scheme({
    title: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    user: {
        type: Scheme.Types.ObjectId,
        ref: 'User',
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const model = mongoose.model('Product', productSchema);

export default model;
