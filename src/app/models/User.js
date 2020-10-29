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
        required: false,
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
    student: {
        type: Boolean,
        default: false,
    },
    siga_linked: {
        type: Boolean,
        default: false,
    },
    mail_verification: {
        isVerified: {
            type: Boolean,
            default: false,
        },
        code: Number,
        expires_at: Date,
    },
    notification_token: String,
});

const model = mongoose.model('User', userSchema);

export default model;
