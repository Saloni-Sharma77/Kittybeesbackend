const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kittyTransactionSchema = new Schema({
    kittyGroupId: {
        type: Schema.Types.ObjectId,
        ref: 'groups',
        required: true
    },
    spentAmount: {
        type: Number,
        required: true
    }
});

const walletTransactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    totalAmountSpentOnKitties: {
        type: Number,
        required: true,
        default: 0
    },
    kittyTransactions: [kittyTransactionSchema]
}, { timestamps: true });

// Pre-save middleware to calculate totalAmountSpentOnKitties
walletTransactionSchema.pre('save', function(next) {
    if (this.isModified('kittyTransactions')) {
        this.totalAmountSpentOnKitties = this.kittyTransactions.reduce((total, kittyTransaction) => {
            return total + kittyTransaction.spentAmount;
        }, 0);
    }
    next();
});

module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);
