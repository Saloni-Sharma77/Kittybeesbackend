const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  type: {
    type: String,
    enum: ['personal', 'group'],
    default: 'personal'
  },
  participants: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
  createdAt: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chats', chatSchema);
module.exports = Chat;
