const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    title: { type: String }, // Title field
    address: { type: String }, // Address field
    location: { type: String }, // Location field
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
