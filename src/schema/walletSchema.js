const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'groups',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transactionType: {
    type: String,
    enum: ['Contribution', 'Expense'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);
