const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pollSchema = new mongoose.Schema({
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
 
}, { _id: false }); // _id: false to prevent creating an additional _id for the embedded schema


const messageArray = new Schema({

  senderId: { type: Schema.Types.ObjectId, ref: 'Users' },
  content: { type: String, default: '' },
  image: { type: String, default: '' },
  video: { type: String, default: '' },
  document: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
  pollOptions: { type: pollSchema, default: null }, // Embed the poll schema


})

const messageSchema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: 'groups' },
  messages : [messageArray]
  
});

const Message = mongoose.model('Messages', messageSchema);
module.exports = Message;
