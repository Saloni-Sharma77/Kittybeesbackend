const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema({
  name: { type: String },
  groupId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'groups' }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  theamepoll: { type: mongoose.Schema.Types.Mixed }, // Use Mixed to handle different poll types
  locationpoll: { type: mongoose.Schema.Types.Mixed },
  venuepoll: { type: mongoose.Schema.Types.Mixed },
  date: { type: String },
  time: { type: String },
  instructions: { type: String },
  themeId: { type: mongoose.Schema.Types.ObjectId, ref: 'theme' },
  colorId: { type: mongoose.Schema.Types.ObjectId, ref: 'color' },
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'venues' },
  addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
  activityId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'activity' }],
  templateId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'template' }],
  image: { type: String },
  isActive: { type: Boolean, default: true },
  isDraft: { type: Boolean, default: true }, // Add isDraft field
}, { timestamps: true });

module.exports = mongoose.model('Draft', draftSchema);
