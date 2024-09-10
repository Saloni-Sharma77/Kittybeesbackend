const mongoose = require('mongoose'); // Import mongoose


const citySchema = new mongoose.Schema({
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('City', citySchema);
