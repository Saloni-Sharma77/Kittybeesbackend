const mongoose = require('mongoose');

const fcmTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users', // Reference to the User schema
      required: true,
    },
    deviceType: {
      type: String,
      enum: ['Android', 'iOS', 'Web'],
      required: true,
    },
    fcmToken: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model('FcmToken', fcmTokenSchema);
