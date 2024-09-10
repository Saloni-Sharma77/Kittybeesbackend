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
      return res.status(400).json({ message: 'User already exists in the group' });
    }

    // Add user to the group
    group.userIds.push({ userId, status });
    await group.save();

    res.status(200).json({ message: 'User added to group successfully', group });
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
// Get pending request user IDs for a group
const getPendingUserIds = async (req, res) => {
  try {
    const { groupId } = req.params;  // Get groupId from URL params

    if (!groupId) {
      return res.status(400).json({ message: 'groupId is required' });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Filter for pending requests and get the userIds
    const pendingUserIds = group.userIds
      .filter(user => user.status === 'pending')
      .map(user => user.userId);  // Extract only userId from pending requests

    if (pendingUserIds.length === 0) {
      return res.status(200).json({ message: 'No pending requests found', pendingUserIds });
    }

    res.status(200).json({ message: 'Pending user IDs retrieved', pendingUserIds });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





  

module.exports = {
  addUserToGroup,
  getPendingUserIds,
  updateUserStatus,
  
};
