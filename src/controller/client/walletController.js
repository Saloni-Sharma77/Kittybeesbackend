const WalletModel = require("../../schema/walletSchema");
const moment = require("moment"); // Add moment.js to handle date formatting
const mongoose = require("mongoose");

exports.getAllWalletTransactionHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    let userObjectId;
    try {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch (err) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    const transactions = await WalletModel.find({ userId: userObjectId })
      .populate("userId")
      .populate("kittyId", "name image")
      .populate("groupId", "name");

    if (!transactions.length) {
      return res
        .status(404)
        .json({ message: "No transactions found for this kittyId" });
    }

    const groupedByDate = transactions.reduce((result, transaction) => {
      const date = moment(transaction.date).format("YYYY-MM-DD");
      if (!result[date]) {
        result[date] = [];
      }
      result[date].push(transaction);
      return result;
    }, {});

    // Convert grouped object to an array format if preferred
    const groupedArray = Object.entries(groupedByDate).map(
      ([date, transactions]) => ({
        date,
        transactions,
      })
    );

    res.status(200).json({
      message: "Totals fetched successfully",
      data: groupedArray,
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching getAllWalletTransactionOfUser",
    });
  }
};

exports.getAllWalletTransactionsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    let userObjectId;
    try {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch (err) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    // Aggregate total contributions and expenses for the user
    const totals = await WalletModel.aggregate([
      { $match: { userId: userObjectId } }, // Match transactions for the specific user
      {
        $group: {
          _id: "$transactionType", // Group by transactionType
          totalAmount: { $sum: "$amount" }, // Sum up the amounts
        },
      },
    ]);

    // Prepare the response structure
    const response = {
      totalContributions: 0,
      totalExpenses: 0,
    };

    // Process the totals to get contributions and expenses
    totals.forEach((transaction) => {
      if (transaction._id === "Contribution") {
        response.totalContributions = transaction.totalAmount;
      } else if (transaction._id === "Expense") {
        response.totalExpenses = transaction.totalAmount;
      }
    });

    console.log(response);
    res.status(200).json({
      message: "Totals fetched successfully",
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching totals" });
  }
};

exports.addExpenseAndContributionForKitty = async (req, res) => {
  try {
    const {
      userId,
      receiverId,
      groupId,
      kittyId,
      amount,
      transactionType,
      date,
      description,
    } = req.body;

    // Validate the required fields
    if (!userId || !groupId || !kittyId || !amount || !transactionType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if transactionType is valid
    const validTransactionTypes = ["Contribution", "Expense"];
    if (!validTransactionTypes.includes(transactionType)) {
      return res.status(400).json({ error: "Invalid transactionType" });
    }

    // Create a new wallet entry
    const newExpense = new WalletModel({
      userId,
      groupId,
      receiverId,
      kittyId,
      amount,
      transactionType,
      date: date || Date.now(),
      description, // Optional field
    });

    // Save to the database
    const savedExpense = await newExpense.save();

    // Send a success response
    res
      .status(201)
      .json({ message: "Expense added successfully", data: savedExpense });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while adding the expense" });
  }
};

exports.getAllWalletTransactionsForKitty = async (req, res) => {
  try {
    const { kittyId } = req.params;

    // Validate kittyId
    if (!kittyId) {
      return res.status(400).json({ error: "kittyId is required" });
    }

    // Fetch all transactions related to the given kittyId
    const transactions = await WalletModel.find({ kittyId })
      .populate("userId")
      .populate("receiverId","fullname profileImage")
      .populate("kittyId", "name image")
      .populate("groupId", "name");


    // Check if transactions exist
    if (!transactions.length) {
      return res
        .status(404)
        .json({ message: "No transactions found for this kittyId" });
    }

    // Group transactions by date
    const groupedByDate = transactions.reduce((result, transaction) => {
      // Format the date to 'YYYY-MM-DD' format to ignore time part
      const date = moment(transaction.date).format("YYYY-MM-DD");
      // Initialize array if date key does not exist
      if (!result[date]) {
        result[date] = [];
      }
      // Push the transaction into the date's array
      result[date].push(transaction);
      return result;
    }, {});

    // Convert grouped object to an array format if preferred
    const groupedArray = Object.entries(groupedByDate).map(
      ([date, transactions]) => ({
        date,
        transactions,
      })
    );

    // Send a success response with grouped transactions
    res.status(200).json({
      message: "Transactions retrieved successfully",
      data: groupedArray,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching transactions" });
  }
};

exports.getUserWalletForGroup = async (req, res) => {
  const { userId, groupId } = req.params; // Assuming you get these from the request params

  try {
    const walletEntries = await WalletModel.find({
      userId: userId,
      groupId: groupId,
    });

    if (walletEntries.length === 0) {
      return res.status(404).json({
        message: "No wallet entries found for this user in the group",
      });
    }

    res.status(200).json({ walletEntries });
  } catch (error) {
    console.error("Error fetching wallet entries:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsersWalletForGroup = async (req, res) => {
  const { groupId } = req.params; // Assuming groupId is passed in request params

  try {
    const walletEntries = await WalletModel.find({
      groupId: groupId,
    });

    if (walletEntries.length === 0) {
      return res
        .status(404)
        .json({ message: "No wallet entries found for this group" });
    }

    res.status(200).json({ walletEntries });
  } catch (error) {
    console.error("Error fetching wallet entries for group:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
