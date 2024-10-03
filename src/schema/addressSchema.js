const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    title: { type: String }, // Title field
    address: { type: String }, // Address field
    image: { type: String ,default:'https://kittybee.s3.ap-south-1.amazonaws.com/kitty_banners/defaultIndorVenue.png'},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }, // User who made the comment
    lat: { type: String },
    long: { type: String },
    location: { type: String }, // Location field
    kittiesHappened: { type: Number, default: 0 },  // New field
    kittiesBooked: { type: Number, default: 0 }   ,  // New field
     pricing: { type: String, default:'500-1000'},

    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
