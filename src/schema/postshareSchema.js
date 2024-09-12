// postshareschema.js
const mongoose = require('mongoose');

const postShareSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
}, { timestamps: true });

module.exports = mongoose.model('PostShare', postShareSchema);
