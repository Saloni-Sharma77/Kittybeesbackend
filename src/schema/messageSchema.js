const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const pollOptionSchema = new mongoose.Schema({
  question: {
    type: String,
  },
  options: [{
    optionText: {
      type: String,
    },
    votes: {
      type: Number,
      default: 0
    }
  }],
 
}, { _id: false }); 

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
