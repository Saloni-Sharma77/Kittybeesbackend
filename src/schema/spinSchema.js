// models/spinSchema.js
const mongoose = require('mongoose');

const SpinSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'groups', required: true },
  users: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    number: { type: Number, required: true }
  }],
}, { timestamps: true });

module.exports = mongoose.model('Spin', SpinSchema);
