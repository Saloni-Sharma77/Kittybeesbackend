const mongoose = require('mongoose');

const postTagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const PostTag = mongoose.model('PostTag', postTagSchema);

module.exports = PostTag;
