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
});

fileSchema
    .virtual('url', {
        ref: 'url',
        localField: 'url',
        foreignField: 'url',
    })
    .get(function () {
        return `http://localhost:3333/files/${this.path}`;
    });

fileSchema.set('toObject', { virtuals: true });
fileSchema.set('toJSON', { virtuals: true });

const model = mongoose.model('File', fileSchema);

export default model;
