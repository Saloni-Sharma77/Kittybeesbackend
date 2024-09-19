// models/groupSchema.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  userIds: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
      status: { type: String, enum: ['pending', 'approved'], required: true }
    }
  ]
});

module.exports = mongoose.model('Group', groupSchema);
