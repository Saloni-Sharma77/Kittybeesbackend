// controllers/groupController.js
const Group = require('../../schema/requesttojoingroupSchema');


// Add user to a group
const addUserToGroup = async (req, res) => {
  try {
    const { groupId, userId, status } = req.body;

    if (!groupId || !userId || !status) {
      return res.status(400).json({ message: 'groupId, userId, and status are required' });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is already in the group
    const existingUser = group.userIds.find(u => u.userId.toString() === userId.toString());

    if (existingUser) {
      return res.status(200).json({ message: 'User already exists in the group' });
    }

    // Add user to the group
    group.userIds.push({ userId, status });
    await group.save();

    res.status(200).json({ message: 'Join Request Sent successfully ', group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the status of a user in a group
const updateUserStatus = async (req, res) => {
  try {
    const { groupId, userId, status } = req.body;

    if (!groupId || !userId || !status) {
      return res.status(400).json({ message: 'groupId, userId, and status are required' });
    }

    // Validate status
    if (!['pending', 'approved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Find user in the group
    const user = group.userIds.find(u => u.userId.toString() === userId.toString());

    if (!user) {
      return res.status(404).json({ message: 'User not found in the group' });
    }

    // Update user status
    user.status = status;
    await group.save();

    res.status(200).json({ message: 'User status updated successfully', group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all pending requests from groups where the user is the admin
const getPendingRequestsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;  // Get userId from URL params

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Find all groups where the user is the admin
    const groups = await Group.find({ userId: userId });

    if (!groups || groups.length === 0) {
      return res.status(404).json({ message: 'No groups found for this user' });
    }

    // Collect all pending user IDs from these groups
    const pendingRequests = groups.flatMap(group =>
      group.userIds
        .filter(user => user.status === 'pending')
        .map(user => ({
          groupId: group._id,
          userId: user.userId
        }))
    );

    if (pendingRequests.length === 0) {
      return res.status(200).json({ message: 'No pending requests found', pendingRequests });
    }

    res.status(200).json({ message: 'Pending requests retrieved', pendingRequests });
  } catch (error) {
    console.error("Error retrieving pending requests:", error);
    res.status(500).json({ message: error.message });
  }
};


  

module.exports = {
  addUserToGroup,
  getPendingRequestsByUserId,
  updateUserStatus,
  
};
