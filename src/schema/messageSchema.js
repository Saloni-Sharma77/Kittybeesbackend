const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  chatId: { type: Schema.Types.ObjectId, ref: 'Chats' },
  sender: { type: Schema.Types.ObjectId, ref: 'Users' },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Messages', messageSchema);
module.exports = Message;
