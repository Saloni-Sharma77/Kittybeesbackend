// const Group = require('../../schema/groupSchema');
// const Notification = require('../../schema/requeststatusSchema');
// const User = require('../../schema/userSchema');

// // Function to send notification to admin
// async function notifyAdmin(groupId, requestUserId) {
//   try {
//     // Find the admin (you may need to adjust this to fit your admin retrieval logic)
//     const admin = await User.findOne({ isAdmin: true }); // Adjust as per your logic to fetch admin

//     if (!admin) {
//       throw new Error('Admin not found');
//     }

//     // Create a notification
//     const notification = new Notification({
//       userId: admin._id,
//       groupId,
//       requestUserId,
//       message: `User ${requestUserId} has requested to join the group ${groupId}. Please review their request.`,
//     });

//     await notification.save();

//     console.log('Notification sent to admin.');
//   } catch (error) {
//     console.error('Error sending notification:', error);
//   }
// }

// // Function to add a new user request and notify admin
// async function addUserRequest(groupId, requestUserId) {
//   try {
//     const group = await Group.findById(groupId);

//     if (!group) {
//       throw new Error('Group not found');
//     }

//     // Check if the user request is already present
//     const existingRequest = group.userIds.find(
//       (userRequest) => userRequest.userId.toString() === requestUserId.toString()
//     );

//     if (existingRequest) {
//       throw new Error('User request already exists');
//     }

//     // Add the new user request
//     group.userIds.push({
//       userId: requestUserId,
//       status: 'pending',
//     });

//     await group.save();

//     // Notify admin
//     await notifyAdmin(groupId, requestUserId);

//   } catch (error) {
//     console.error('Error adding user request:', error);
//   }
// }
