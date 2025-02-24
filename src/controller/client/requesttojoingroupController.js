// controllers/groupController.js
const Group = require('../../schema/requesttojoingroupSchema');
const NotificationSchema = require('../../schema/notificationSchema');
const UserSchema = require('../../schema/userSchema');



const mongoose = require('mongoose'); // Ensure mongoose is imported at the top

const addUserToGroup = async (req, res) => {
  try {
    const { groupId, userId, status } = req.body;

    if (!groupId || !userId || !status) {
      return res.status(400).json({ message: 'groupId, userId, and status are required' });
    }

    // Find the group by its ID
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    let groupcopy = JSON.parse(JSON.stringify(group))

    const userIds = group.userIds || [];
    console.log(userIds)

    // Check if the user is the admin
    if (group.userId?.toString() === userId?.toString()) {
      return res.status(400).json({ error: 'You are the Group Admin!' });
    }

    // Check if the user is already in the group
    const existingUser = userIds.find(u => u.userId?.toString() === userId?.toString());
    if (existingUser) {
      return res.status(400).json({ error: 'User request already sent!' });
    }

    // Add the new user with pending status
    group.userIds.push({
      userId: userId, // Ensure this is an ObjectId
      status: status || 'pending'
    });

    // Save the group with the updated user list
    await group.save();

    // Fetch the user details
    const user = await UserSchema.findById(userId).select('fullname');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send a notification to the group admin
    const adminNotification = new NotificationSchema({
      userId: groupcopy.userId, // Notification to the group admin
      groupId: groupId,
      requestUserId: userId,
      message: `${user.fullname} has requested to join your group: ${groupcopy.name}`,
      type: 'group-join-request'
    });

    // Save the notification
    await adminNotification.save();

    res.status(200).json({ message: 'Join request sent successfully', group });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
};




const updateUserStatus = async (req, res) => {
  try {
    const { groupId, userId, status, notificationId } = req.body;

    if (!groupId || !userId || !status || !notificationId) {
      return res.status(400).json({ message: 'groupId, userId, status, and notificationId are required' });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    let groupcopy = JSON.parse(JSON.stringify(group));

    // Find the user in the group
    const user = group.userIds.find(u => u.userId.toString() === userId.toString());

    if (!user) {
      return res.status(404).json({ message: 'User not found in the group' });
    }

    // Update user status in the group
    user.status = status;
    await group.save();

    // Define the notification messages
    const notificationMessage = status === 'approved'
      ? `Your request to join the group: ${groupcopy.name} has been approved.`
      : `Your request to join the group: ${groupcopy.name} has been rejected.`;

    const hostNotificationMessage = status === 'approved'
      ? `You have accepted the invitation for group: ${groupcopy.name}.`
      : `You have rejected the invitation for group: ${groupcopy.name}.`;

    console.log(notificationMessage, hostNotificationMessage);

    // Update the notification for the host, including the status update
    const notificationStatus = status === 'approved' ? 'accepted' : 'rejected';

    await NotificationSchema.findByIdAndUpdate(
      notificationId,
      { message: hostNotificationMessage, type: 'group', status: notificationStatus },
      { new: true, upsert: true }
    );

    // Send a new notification to the user
    const userNotification = new NotificationSchema({
      userId, 
      groupId,
      message: notificationMessage,
      type: 'group',
      status: notificationStatus // Update the status field here
    });

    await userNotification.save();

    res.status(200).json({ message: 'User status and notification updated successfully', group });
  } catch (error) {
    console.error('Error updating user status:', error);
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
