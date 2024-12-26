const WalletModel = require("../../schema/walletSchema");
const WalletCategeorymodel = require("../../schema/WalletCategorySchema");
const Kitty = require("../../schema/kittySchema");

const moment = require("moment"); // Add moment.js to handle date formatting
const mongoose = require("mongoose");

exports.getAllWalletTransactionHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, categoryType } = req.query;
    // Validate userId
    let userObjectId;
    try {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch (err) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    // Define the query condition based on type and categoryType
    const queryCondition = { userId: userObjectId };
    if (type) {
      queryCondition.transactionType = type; // Match with `type` directly
    }

    // console.log("Query Condition before categoryType:", queryCondition);

    // Fetch transactions
    let transactions = await WalletModel.find(queryCondition)
      .populate("userId")
      .populate("kittyId", "name image")
      .populate("groupId", "name")
      .populate("walletCategoryId", "name")
      .sort({ date: -1 }); // Sort by date in descending order (latest first)

    // Filter by categoryType if provided
    if (categoryType) {
      transactions = transactions.filter(
        (transaction) =>
          transaction.walletCategoryId &&
          transaction.walletCategoryId.name === categoryType
      );
    }

    if (!transactions.length) {
      return res
        .status(404)
        .json({ message: "No transactions found for this query" });
    }

    const groupedByDate = transactions.reduce((result, transaction) => {
      const date = moment(transaction.date).format("YYYY-MM-DD");
      if (!result[date]) {
        result[date] = [];
      }
      result[date].push(transaction);
      return result;
    }, {});

    // Convert grouped transactions to array
    const groupedArray = Object.entries(groupedByDate).map(
      ([date, transactions]) => ({
        date,
        transactions,
      })
    );

    // Send response
    res.status(200).json({
      message: "Transactions fetched successfully",
      data: groupedArray,
    });
  } catch (error) {
    console.error("Error:", error); // Log the actual error
    res.status(500).json({
      error: "An error occurred while fetching transaction history",
    });
  }
};



exports.addWalletCategory = async(req, res)=>{
    try {
      const {
      name
      } = req.body;
      const wallcat = new WalletCategeorymodel({
      name
      });
      await wallcat.save();
  
      res
        .status(201)
        .json({ message: "added successfully"});
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while adding" });
    }
}

exports.getWalletCategory = async(req, res)=>{
  try{
    const wallCat = await WalletCategeorymodel.find()
    return  res.status(200).json({
      data: wallCat
    });

  }catch(err){
    return  res.status(500).json({
      error: "An error occurred while fetching",
    });
  }
}



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
      totalTransactionContributions: 0,
      totalExpenses: 0,
      totalTransactionExpenses: 0,
    };
    let totalcontrTrans = await WalletModel.aggregate([
      { $match: { userId: userObjectId,transactionType:'Contribution' } },
      { $count: "total" }
    ]);

    let totalexpTrans = await WalletModel.aggregate([
      { $match: { userId: userObjectId,transactionType:'Expense' } },
      { $count: "total" }
    ]);

    // Process the totals to get contributions and expenses
    totals.forEach((transaction) => {
      if (transaction._id === "Contribution") {
        response.totalContributions = transaction.totalAmount;
        response.totalTransactionContributions = totalcontrTrans?.length ? totalcontrTrans[0]?.total : 0;

      } else if (transaction._id === "Expense") {
        response.totalExpenses = transaction.totalAmount;
        response.totalTransactionExpenses =  totalexpTrans?.length ? totalexpTrans[0]?.total : 0;;

        
      }
    });

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
      invoice,
      walletCategoryId,
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
      walletCategoryId,
      invoice,
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
    let expenseTotal = 0;
    let contributionTotal = 0;


    const groupedByDate = transactions.reduce((result, transaction) => {
      if(transaction?.transactionType == 'Expense'){
        expenseTotal +=  transaction?.amount;
        console.log(transaction.expenseTotal,'transactionExpense')

      }
      if(transaction?.transactionType == 'Contribution'){
        contributionTotal +=  transaction?.amount;
        
      }
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
    console.log(groupedByDate,'groupedByDate',expenseTotal,contributionTotal)

    // Convert grouped object to an array format if preferred
    const groupedArray = Object.entries(groupedByDate).map(
      ([date, transactions]) => ({
        date,
        transactions,
      })
    );
    total={
      expenseTotal:expenseTotal,
      contributionTotal:contributionTotal
      
    }

    // Send a success response with grouped transactions
    res.status(200).json({
      message: "Transactions retrieved successfully",
      data: groupedArray,
      total:total
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
    }).populate('kittyId','name image').populate('groupId','name image');

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


// exports.getKittiesFundsForUser = async (req, res)=>{
//   try {
//     const { userId } = req.params; // Assuming userId is passed as a URL parameter

//     if (!userId) {
//       return res.status(400).json({ success: false, message: "UserId is required." });
//     }

//     // Query to find kitties where the given userId exists in members with status 'approved'
//     const kitties = await Kitty.find({
//       $or: [
//         { userId: userId }, // Matches root userId
//         { "members": { $elemMatch: { userId: userId, status: "approved" } } },
//       ],
//     })
//       .select("name image members userId date time") // Include only name and image fields
//       .populate("members.userId", "profileImage fullname"); // Populate members.userId with profileImage and fullname
    

//     if (kitties.length === 0) {
//       return res.status(404).json({ success: false, message: "No kitties found for the given userId." });
//     }

//     return res.status(200).json({ success: true, data: kitties });
//   } catch (error) {
//     console.error("Error fetching kitties:", error);
//     return res.status(500).json({ success: false, message: "Internal server error.", error });
//   }


// }


const combineDateAndTime = (dateStr, timeStr) => {
  const dateParts = dateStr.split(/[\/-]/).map(Number); // Split date by '/' or '-'
  const [day, month, year] = dateParts.length === 3 ? dateParts : [null, null, null];
  const [time, modifier] = timeStr.split(" "); // Split time into time and AM/PM
  const [hours, minutes] = time.split(":").map(Number); // Extract hours and minutes
  const hours24 = modifier === "PM" && hours !== 12 ? hours + 12 : hours === 12 && modifier === "AM" ? 0 : hours;
  return new Date(year, month - 1, day, hours24, minutes); // Create a Date object
};

exports.getKittiesFundsForUser = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming userId is passed as a URL parameter

    if (!userId) {
      return res.status(400).json({ success: false, message: "UserId is required." });
    }

    // Query to find kitties where the given userId exists in members with status 'approved'
    const kitties = await Kitty.find({
      $or: [
        { userId: userId }, // Matches root userId
        { "members": { $elemMatch: { userId: userId, status: "approved" } } },
      ],
    })
      .select("name image members userId date time") // Include only name and image fields
      .populate("members.userId", "profileImage fullname"); // Populate members.userId with profileImage and fullname

    if (kitties.length === 0) {
      return res.status(404).json({ success: false, message: "No kitties found for the given userId." });
    }

    // Sort kitties based on combined date and time
    const sortedKitties = kitties.sort((a, b) => {
      const dateA = combineDateAndTime(a.date, a.time);
      const dateB = combineDateAndTime(b.date, b.time);
      return  dateB  - dateA ; // Sort in ascending order
    });

    return res.status(200).json({ success: true, data: sortedKitties });
  } catch (error) {
    console.error("Error fetching kitties:", error);
    return res.status(500).json({ success: false, message: "Internal server error.", error });
  }
};


exports.getFundOfKitty = async (req, res) => {
  try {
    const { kittyId } = req.params; // Assuming kittyId is passed as a URL parameter

    if (!kittyId) {
      return res.status(400).json({ success: false, message: "Kitty ID is required." });
    }

    // Fetch wallet details for the given kittyId
    const walletDetails = await WalletModel.find({ kittyId, transactionType: "Contribution" })
      .populate("userId", "profileImage fullname") // Populate user details
      .select("userId amount date description"); // Select relevant fields

    if (walletDetails.length === 0) {
      return res.status(404).json({ success: false, message: "No contributions found for this kitty." });
    }

    return res.status(200).json({ success: true, data: walletDetails });
  } catch (error) {
    console.error("Error fetching wallet details:", error);
    return res.status(500).json({ success: false, message: "Internal server error.", error });
  }
};

