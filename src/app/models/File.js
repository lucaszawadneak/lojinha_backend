import mongoose from 'mongoose';

const Scheme = mongoose.Schema;

const fileSchema = new Scheme({
    name: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
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

fileSchema.virtual('url').get(() => {
    return `http://localhost:3333/${this.path}`;
});

const model = mongoose.model('File', fileSchema);

export default model;
