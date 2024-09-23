const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    name: { type: String },
    userId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }], // Keep this as is
    venueId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Venue" }], // Use the correct model name here
    description: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema); // Ensure the model name is capitalized
