const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageArray = new Schema({

  senderId: { type: Schema.Types.ObjectId, ref: 'Users' },
  content: { type: String, required: true },
  image: { type: String, default: null },
  video: { type: String, default: null },
  timestamp: { type: Date, default: Date.now }
})

const messageSchema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: 'groups' },
  messages : [messageArray]
  
});

const Message = mongoose.model('Messages', messageSchema);
module.exports = Message;
