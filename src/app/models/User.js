import mongoose from 'mongoose';

const Scheme = mongoose.Schema;

const userSchema = new Scheme({
    cpf: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password_hash: String,
    avatar: {
        type: Scheme.Types.ObjectId,
        ref: 'File',
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    edited_at: {
        type: Date,
        default: Date.now,
    },
});

const model = mongoose.model('User', userSchema);

export default model;
