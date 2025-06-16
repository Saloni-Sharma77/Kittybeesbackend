const mongoose = require('mongoose');

const postTagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
});

const PostTag = mongoose.model('PostTag', postTagSchema);

module.exports = PostTag;
