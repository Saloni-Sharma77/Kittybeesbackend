const WalletTransaction = require('../../schema/wallettransectionhistorySchema'); // Adjust the path to where your schema file is located

// Create a new wallet transaction
exports.createWalletTransaction = async (req, res) => {
    try {
        const walletTransaction = new WalletTransaction(req.body);
        await walletTransaction.save();
        res.status(201).json(walletTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all wallet transactions
exports.getAllWalletTransactions = async (req, res) => {
    try {
        const walletTransactions = await WalletTransaction.find().populate('userId');
        res.status(200).json(walletTransactions);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get wallet transactions by user ID
exports.getWalletTransactionsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const walletTransactions = await WalletTransaction.find({ userId }).populate('userId').populate('kittyTransactions.kittyGroupId');
        if (walletTransactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found for this user' });
        }

        res.status(200).json(walletTransactions);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a wallet transaction by ID
exports.updateWalletTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const walletTransaction = await WalletTransaction.findByIdAndUpdate(id, req.body, { new: true });
        if (!walletTransaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json(walletTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a wallet transaction by ID
exports.deleteWalletTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const walletTransaction = await WalletTransaction.findByIdAndDelete(id);
        if (!walletTransaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};




// const WalletTransaction = require('../../schema/wallettransectionhistorySchema');

// // Create a new wallet transaction (common for both user and admin)
// exports.createWalletTransaction = async (req, res) => {
//     try {
//         const walletTransaction = new WalletTransaction(req.body);
//         await walletTransaction.save();
//         res.status(201).json(walletTransaction);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // Admin: Get all wallet transactions
// exports.getAllWalletTransactions = async (req, res) => {
//     try {
//         const walletTransactions = await WalletTransaction.find()
//             .populate('userId', 'name email') // Populate user info
//             .populate('kittyTransactions.kittyGroupId', 'name'); // Populate group info
//         res.status(200).json(walletTransactions);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // User: Get wallet transactions by user ID
// exports.getWalletTransactionsByUserId = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const walletTransactions = await WalletTransaction.find({ userId })
//             .populate('userId', 'name email')
//             .populate('kittyTransactions.kittyGroupId', 'name');

//         if (walletTransactions.length === 0) {
//             return res.status(404).json({ message: 'No transactions found for this user' });
//         }

//         res.status(200).json(walletTransactions);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // Admin: Update a wallet transaction by ID
// exports.updateWalletTransaction = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const walletTransaction = await WalletTransaction.findByIdAndUpdate(id, req.body, { new: true })
//             .populate('userId', 'name email')
//             .populate('kittyTransactions.kittyGroupId', 'name');

//         if (!walletTransaction) {
//             return res.status(404).json({ message: 'Transaction not found' });
//         }

//         res.status(200).json(walletTransaction);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // Admin: Delete a wallet transaction by ID
// exports.deleteWalletTransaction = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const walletTransaction = await WalletTransaction.findByIdAndDelete(id);

//         if (!walletTransaction) {
//             return res.status(404).json({ message: 'Transaction not found' });
//         }

//         res.status(200).json({ message: 'Transaction deleted successfully' });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };
