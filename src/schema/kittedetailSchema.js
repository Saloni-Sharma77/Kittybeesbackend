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
  }
});

module.exports = mongoose.model('KittyDetail', kittyDetailSchema);
