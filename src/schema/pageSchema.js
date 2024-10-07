const mongoose = require('mongoose');

// Fixed Pages Schema
const PageSchema = new mongoose.Schema({
  pageName: { type: String, required: true, unique: true }, // Unique page name
});

module.exports = mongoose.model('Page', PageSchema);
