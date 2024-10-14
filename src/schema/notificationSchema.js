// models/notificationSchema.js
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'groups' },
    kittyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kitty' },
    requestUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    message: { type: String},
    type: {type:String,
      enum: ['group', 'kitty', 'message','group-join-request'], 
    },
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'rejected'], 
      default: 'pending' 
    },
    isRead: {
      type: Boolean,
      default: false
    },
  
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
