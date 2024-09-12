const mongoose = require('mongoose'); // Import mongoose

const typeSchema = new mongoose.Schema({
    type: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('VenueType', typeSchema); // Ensure the model name is 'VenueType'
