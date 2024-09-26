const mongoose = require('mongoose');

// Define the poll schema
const pollSchema = new mongoose.Schema({
  question: {
    type: String,
  },
  options: [{
    optionText: {
      type: String,
    },
    votes: {
      type: Number,
      default: 0
    }
  }],
  type: {
    type: String,
    enum: ['theampolls', 'locationpolls', 'venuepolls'],
  }
}, { _id: false }); // _id: false to prevent creating an additional _id for the embedded schema

// Define the Kitty schema
const KittySchema = new mongoose.Schema({
  name: { type: String },
  groupId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'groups' }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }, // Updated to a single ObjectId
  theamepoll: { type: pollSchema, default: null }, // Embed the poll schema
  locationpoll: { type: pollSchema, default: null }, // Embed the poll schema
  venuepoll: { type: pollSchema, default: null }, // Embed the poll schema
  date: { type: String },
  time: { type: String },
  instructions: { type: String },
  themeId: { type: mongoose.Schema.Types.ObjectId, ref: 'theme' },
  colorId: { type: mongoose.Schema.Types.ObjectId, ref: 'color' },
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
  activityId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'activity' }],
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  image: { type: String },
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    status: { type: String, enum: ['pending', 'approved','rejected'], default: 'pending' }
}],
kittyMemories:[{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  memoryimage: { type: String }, 
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Kitty', KittySchema);
