const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pollOptionSchema = new Schema({
  option: { type: String, required: true },
  votes: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'Users' }, // User who voted
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const messageArray = new Schema({

  senderId: { type: Schema.Types.ObjectId, ref: 'Users' },
  content: { type: String, default: '' },
  image: { type: String, default: '' },
  video: { type: String, default: '' },
  document: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
  pollOptions: [pollOptionSchema], 

})

const messageSchema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: 'groups' },
  messages : [messageArray]
  
});

const Message = mongoose.model('Messages', messageSchema);
module.exports = Message;
