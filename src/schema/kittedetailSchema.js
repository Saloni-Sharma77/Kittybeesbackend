const mongoose = require('mongoose');

const kittyDetailSchema = new mongoose.Schema({
  partyBanner: {
    type: String, // URL of the banner image
    required: true
  },
  partyName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  groupName: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: 'Users', // Assuming you have a 'User' model
    required: true
  },
  plannedActivities: {
    type: [String], // Array of planned activities
    default: [] // Default to an empty array
  },
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1, // Assuming a rating scale of 1 to 5
      max: 5
    },
    dateRated: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('KittyDetail', kittyDetailSchema);
