const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
  createdAt: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chats', chatSchema);
module.exports = Chat;
