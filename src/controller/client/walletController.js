const WalletModel = require("../../schema/walletSchema");


exports.getUserWalletForGroup = async (req, res) => {
    const { userId, groupId } = req.params; // Assuming you get these from the request params
  
    try {
      const walletEntries = await WalletModel.find({
        userId: userId,
        groupId: groupId
      });
  
      if (walletEntries.length === 0) {
        return res.status(404).json({ message: "No wallet entries found for this user in the group" });
      }
  
      res.status(200).json({ walletEntries });
    } catch (error) {
      console.error('Error fetching wallet entries:', error.message);
      res.status(500).json({ message: "Server error" });
    }
  };
  

  exports.getAllUsersWalletForGroup = async (req, res) => {
    const { groupId } = req.params; // Assuming groupId is passed in request params
  
    try {
      const walletEntries = await WalletModel.find({
        groupId: groupId
      });
  
      if (walletEntries.length === 0) {
        return res.status(404).json({ message: "No wallet entries found for this group" });
      }
  
      res.status(200).json({ walletEntries });
    } catch (error) {
      console.error('Error fetching wallet entries for group:', error.message);
      res.status(500).json({ message: "Server error" });
    }
  };
  