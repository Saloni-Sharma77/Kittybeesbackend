// pollModel.js
const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    optionText: {
      type: String,
      required: true
    },
    votes: {
      type: Number,
      default: 0
    }
  }],
  type: {
    type: String,
    enum: ['theampolls', 'locationpolls', 'venuepolls'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Poll', pollSchema);
