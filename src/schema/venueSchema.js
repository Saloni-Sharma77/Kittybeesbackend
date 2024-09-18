const mongoose = require('mongoose'); // Import mongoose

const GroupSchema = new mongoose.Schema({
  name: { type: String },
  userId: { type: String, ref: 'Users' },
  venueCatId: { type: String, ref: 'venueCategory' },
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  location: { type: String },
  lat: { type: String },
  long: { type: String },
  image: { type: String },
  pricing: { type: String },
  contactNo: { type: String },
  isActive: { type: Boolean, default: true },
  venueTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'VenueType' },
  kittiesHappened: { type: Number, default: 0 },  // New field
  kittiesBooked: { type: Number, default: 0 }     // New field
}, { timestamps: true });

module.exports = mongoose.model('Venue', GroupSchema);
