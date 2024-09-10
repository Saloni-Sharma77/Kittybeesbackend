// // models/notificationSchema.js
// const mongoose = require('mongoose');

// const NotificationSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
//     groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'groups', required: true },
//     requestUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
//     message: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('Notification', NotificationSchema);
