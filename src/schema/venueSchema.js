const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: { type: String },
  userId: { type: String, ref: 'Users' },
  venueCatId: { type: String, ref: 'venueCategory' },
  cityId: { type: String, ref: 'city' },
  location: { type: String },
  lat: { type: String },                     
  long: { type: String },
  image: { type: String },
  pricing: { type: String },
  contactNo: { type: String },
  isActive: { type: Boolean, default: true },
  venueTypeId: { type: String, ref: 'venueType' } // Added venueTypeId field
}, { timestamps: true });

module.exports = mongoose.model('venues', GroupSchema);
