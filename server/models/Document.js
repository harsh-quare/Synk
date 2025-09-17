const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
        default: 'Untitled'
    },
    data: {
        type: Object,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);