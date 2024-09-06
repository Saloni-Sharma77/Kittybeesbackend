const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  optionText: {
    type: String,
    
  },
  votes: {
    type: Number,
    default: 0
  }
});

const theamepollschema = new mongoose.Schema({
  question: {
    type: String,
    
  },
  options: [optionSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('TheamePoll', theamepollschema);
