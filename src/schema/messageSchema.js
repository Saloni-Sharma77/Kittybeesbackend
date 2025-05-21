const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
  },
  options: [{
    optionId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(), // Correct way to generate a unique ID
    },
    optionText: {
      type: String,
    },
    votes: {
      type: Number,
      default: 0
    },
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }], // Track users who voted for this option
    
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
  amount: { type: Number, default: 0 }, // Store amount value
  amountType: { type: String, enum: ['Contribution', 'Expense'], default: 'Contribution' }, // Store type of amount
  name: { type: String, default: '' }, // Store name
  message: { type: String,}, // Store name
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
})

const messageSchema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: 'groups' },
  messages : [messageArray]
  
});

const Message = mongoose.model('Messages', messageSchema);
module.exports = Message;
