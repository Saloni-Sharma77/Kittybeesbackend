// controllers/groupController.js
const Group = require('../../schema/requesttojoingroupSchema');
const NotificationSchema = require('../../schema/notificationSchema');

const mongoose = require('mongoose');



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
 
    const userIds = group.userIds || [];

    // Find a specific user by userId
    const existingUser = userIds.find(u => u?.userId && u?.userId?.toString() === userId?.toString());

    console.log(group?.userId?.toString() ,userId?.toString())
    if (group?.userId?.toString() == userId?.toString()){
      return res.status(400).json({error:'You are Group Admin!'})
     }else if (existingUser) {
      return res.status(400).json({error:'User Request Already sent!'})
    } else {
      console.log('User not found, you can add a new user');
      // Add a new user if needed
      userIds.push({
        userId: userId,  // Assuming userId is available
        status: status || 'pending'
      });
    }


    // No need to push again here, as it's already done above
    await group.save();
    // const notificationData = new 

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

// Get all pending requests from groups where the user is the admin
// const getPendingRequestsByUserId = async (req, res) => {
//   try {
//     const { userId } = req.params;  // Get userId from URL params

//     // Check if userId is provided and is a valid ObjectId
//     if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: 'Invalid or missing userId' });
//     }

//     // Find all groups where the user is the admin (userId is the admin's ID)
//     const groups = await Group.find({ userId: new mongoose.Types.ObjectId(userId) }).populate('userIds.userId');

//     if (!groups || groups.length === 0) {
//       return res.status(404).json({ message: 'No groups found for this user' });
//     }

//     // Collect all pending user IDs from these groups
//     const pendingRequests = groups.flatMap(group =>
//       group.userIds
//         .filter(user => user.status === 'pending')
//         .map(user => ({
//           groupId: group,
//           userId: user.userId
//         }))
//     );

//     if (pendingRequests.length === 0) {
//       return res.status(200).json({ message: 'No pending requests found', pendingRequests });
//     }

//     res.status(200).json({ message: 'Pending requests retrieved', pendingRequests });
//   } catch (error) {
//     console.error("Error retrieving pending requests:", error);
//     res.status(500).json({ message: error.message });
//   }
// };
const getPendingRequestsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;  // Get userId from URL params

    // Check if userId is provided and is a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid or missing userId' });
    }

    // Find all groups where the user is the admin (userId is the admin's ID)
    const groups = await Group.find({ userId: new mongoose.Types.ObjectId(userId) })
      .populate('userIds.userId', 'fullname email profileImage'); // Select only required fields to populate (e.g., name, email)

    if (!groups || groups.length === 0) {
      return res.status(404).json({ message: 'No groups found for this user' });
    }

    // Collect all pending user IDs from these groups
    const pendingRequests = groups.flatMap(group =>
      group.userIds
        .filter(user => user.status === 'pending')
        .map(user => ({
          groupId: group,  // Return only group ID
          // groupName: group.name,  // Optionally add group name
          userId: user.userId,  // Return only user ID
          // userName: user.userId.name,  // Optionally add user name
          // userEmail: user.userId.email  // Optionally add user email

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
