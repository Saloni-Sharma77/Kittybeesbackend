// models/memoriesSchema.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memoriesSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User ID
    required: true,
    ref: 'Users' // Assuming you have a 'User' model
  },
  image: {
    type: String, // Storing image URL as a string
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Memories', memoriesSchema);
