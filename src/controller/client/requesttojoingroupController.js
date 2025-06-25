// controllers/groupController.js
const Group = require('../../schema/requesttojoingroupSchema');
const GroupSchema = require('../../schema/groupSchema');

const NotificationSchema = require('../../schema/notificationSchema');
const UserSchema = require('../../schema/userSchema');
const FcmToken = require('../../schema/FcmSchema'); // Your FCM schema



const mongoose = require('mongoose'); // Ensure mongoose is imported at the top
const { sendPushNotifications } = require('../../PushNotification/pushNotification');

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
    let groupcopy = JSON.parse(JSON.stringify(group))

    const userIds = group.userIds || [];

    if (group.userId?.toString() === userId?.toString()) {
      return res.status(400).json({ error: 'You are the Group Admin!' });
    }

    const existingUser = userIds.find(u => u.userId?.toString() === userId?.toString());
    if (existingUser) {
      return res.status(400).json({ error: 'User request already sent!' });
    }

    group.userIds.push({
      userId: userId, 
      status: status || 'pending'
    });

    await group.save();

    const user = await UserSchema.findById(userId).select('fullname');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const adminNotification = new NotificationSchema({
      userId: groupcopy.userId, 
      groupId: groupId,
      requestUserId: userId,
      message: `${user.fullname} has requested to join your group: ${groupcopy.name}`,
      type: 'group-join-request'
    });
    const adminPush = {
      title: 'Group Join Request',
      message: `${user.fullname} has requested to join your group: ${groupcopy.name}`,
      userId: groupcopy.userId.toString(),
      type: 'group-join-request',
      objectId: groupId
    };
    await sendPushNotifications(adminPush);
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

    const onwerGroupData = await GroupSchema.findById(groupId)
    const groupOwner = onwerGroupData?.userId;
    const userName = await UserSchema.findById(groupOwner).select('fullname');
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
    const fcmTokens = await FcmToken.find({ userId: userId});
    const tokens = fcmTokens
  .flatMap((tokenDoc) => tokenDoc?.fcmToken) // Flatten nested arrays of fcmTokens
  .filter((token) => token && token.trim() !== '');

  const notification = {
    title: 'Group Status Notification',
    message: `${userName?.fullname} has ${notificationStatus} your request`,
    userId: userId.toString(),
    type:"group",
    objectId:groupId
  };
  await sendPushNotifications(notification);
  
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
