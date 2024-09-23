// models/iconSchema.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const iconSchema = new Schema({
  name: {
    type: String,
    required: true, // Required field for the icon name
    unique: true    // Ensure unique icon names
  },
  image: {
    type: String,
    required: true // Required field for the image URL
  }
}, { timestamps: true });

module.exports = mongoose.model('Icon', iconSchema);
