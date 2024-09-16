const mongoose = require('mongoose'); // Import mongoose

const VenueReviewSchema = new mongoose.Schema({
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1 and 5
  reviewText: { type: String, trim: true }, // Review text
  isActive: { type: Boolean, default: true }, // Flag to mark if the review is active
}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt` fields

module.exports = mongoose.model('VenueReview', VenueReviewSchema); // Export the model
