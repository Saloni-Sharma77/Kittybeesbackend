const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }], // Keep this as is
    venueId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Venue" }], // Use the correct model name here
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema); // Ensure the model name is capitalized
