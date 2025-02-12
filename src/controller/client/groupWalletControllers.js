const Wallet = require('../../schema/walletSchema'); 
const WalletTransaction = require('../../schema/wallettransectionhistorySchema');
const mongoose = require('mongoose');

// exports.getTotalAmountOfGroup = async (req, res) => {
//     try {
//         const { groupId } = req.params;
        
//         const totalAmount = await Wallet.aggregate([
//             { $match: { groupId: new mongoose.Types.ObjectId(groupId) } },
//             { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
//         ]);

//         res.json({ totalAmount: totalAmount[0]?.totalAmount || 0 });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Get total expenses on a particular group
// exports.getTotalExpensesOnGroup = async (req, res) => {
//     try {
//         const { groupId } = req.params;

//         const totalExpenses = await Wallet.aggregate([
//             { 
//                 $match: { 
//                     groupId: new mongoose.Types.ObjectId(groupId), 
//                     transactionType: "Expense" 
//                 } 
//             },
//             { $group: { _id: null, totalExpenses: { $sum: "$amount" } } }
//         ]);

//         res.json({ totalExpenses: totalExpenses[0]?.totalExpenses || 0 });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Get total spent on kitties of a group
// exports.getTotalSpentOnKitties = async (req, res) => {
//     try {
//         const { groupId } = req.params;

//         const totalSpent = await WalletTransaction.aggregate([
//             { $match: { "kittyTransactions.kittyGroupId": new mongoose.Types.ObjectId(groupId) } },
//             { 
//                 $group: { 
//                     _id: null, 
//                     totalSpentOnKitties: { $sum: "$totalAmountSpentOnKitties" } 
//                 } 
//             }
//         ]);

//         res.json({ totalSpentOnKitties: totalSpent[0]?.totalSpentOnKitties || 0 });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Get total amount added or spent by users of a group
// exports.getTotalAmountByGroupUsers = async (req, res) => {
//     try {
//         const { groupId } = req.params;

//         const userTransactions = await Wallet.aggregate([
//             { $match: { groupId: new mongoose.Types.ObjectId(groupId) } },
//             { 
//                 $group: { 
//                     _id: "$userId", 
//                     totalAdded: { 
//                         $sum: { 
//                             $cond: [{ $eq: ["$transactionType", "Contribution"] }, "$amount", 0] 
//                         } 
//                     },
//                     totalSpent: { 
//                         $sum: { 
//                             $cond: [{ $eq: ["$transactionType", "Expense"] }, "$amount", 0] 
//                         } 
//                     }
//                 }
//             }
//         ]);

//         res.json({ userTransactions });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


exports.getGroupFinancialSummary = async (req, res) => {
    try {
        const { groupId } = req.params;

        // Convert groupId to ObjectId
        const groupObjectId = new mongoose.Types.ObjectId(groupId);

        // Get total amount added to the group
        const totalAmountResult = await Wallet.aggregate([
            { $match: { groupId: groupObjectId } },
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
        ]);
        const totalAmount = totalAmountResult[0]?.totalAmount || 0;

        // Get total expenses on the group
        const totalExpensesResult = await Wallet.aggregate([
            { 
                $match: { 
                    groupId: groupObjectId, 
                    transactionType: "Expense" 
                } 
            },
            { $group: { _id: null, totalExpenses: { $sum: "$amount" } } }
        ]);
        const totalExpenses = totalExpensesResult[0]?.totalExpenses || 0;

        const totalSpentOnKittiesResult = await Wallet.aggregate([
            { 
                $match: { 
                    groupId: groupObjectId, 
                    kittyId: { $exists: true, $ne: null }, // Ensure it's related to a kitty
                    transactionType: "Expense"
                } 
            },
            { 
                $group: { 
                    _id: null, 
                    totalSpentOnKitties: { $sum: "$amount" } 
                } 
            }
        ]);
        const totalSpentOnKitties = totalSpentOnKittiesResult[0]?.totalSpentOnKitties || 0;
        const remainingAmount = totalAmount - totalExpenses;


        // Get total amount added or spent by each user in the group
        const userTransactions = await Wallet.aggregate([
            { $match: { groupId: groupObjectId } },
            { 
                $group: { 
                    _id: "$userId", 
                    totalAdded: { 
                        $sum: { 
                            $cond: [{ $eq: ["$transactionType", "Contribution"] }, "$amount", 0] 
                        } 
                    },
                    totalSpent: { 
                        $sum: { 
                            $cond: [{ $eq: ["$transactionType", "Expense"] }, "$amount", 0] 
                        } 
                    }
                }
            },
            {
                $lookup: {
                    from: "users", // Make sure the collection name is correct
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" }, // Convert array to object
            {
                $project: {
                    _id: 1,
                    totalAdded: 1,
                    totalSpent: 1,
                    "user._id": 1,
                    "user.fullname": 1, // Assuming 'name' exists in Users collection
                    "user.email": 1 // Assuming 'email' exists in Users collection
                }
            }
        ]);


        res.json({
            groupId,
            totalAmount,
            totalExpenses,
            remainingAmount,
            totalSpentOnKitties,
            userTransactions
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};