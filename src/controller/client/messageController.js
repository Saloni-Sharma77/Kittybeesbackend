const Message = require('../../schema/messageSchema');
const FcmToken = require('../../schema/FcmSchema'); // Your FCM schema
const { sendPushNotificationsCreateMessage } = require('../../PushNotification/pushNotification');


exports.createMessage = async (req, res) => {
  try {
    const { groupId, senderId } = req.body;

    if (!groupId || !senderId) {
      return res.status(400).json({ error: "Group ID and Sender ID are required." });
    }

    // Initialize message data
    const newMessageData = { senderId };

    if (req.body.content) newMessageData.content = req.body.content;
    if (req.body.document) newMessageData.document = req.body.document;
    if (req.body.image) newMessageData.image = req.body.image;
    if (req.body.video) newMessageData.video = req.body.video;

    // Ensure at least one type of message is provided
    if (!newMessageData.content && !newMessageData.image && !newMessageData.video && !newMessageData.document) {
      return res.status(400).json({ error: "At least one of content, document, image, or video must be provided." });
    }

    // Find or create a message document for the group
    let messageDoc = await Message.findOne({ groupId });
    if (!messageDoc) {
      messageDoc = new Message({
        groupId,
        messages: [newMessageData],
      });
    } else {
      messageDoc.messages.push(newMessageData);
    }

    // Save the message document
    let savedDoc = await messageDoc.save();

    // Populate relevant fields
    savedDoc = await savedDoc.populate([
      { path: "messages.senderId", select: "fullname" },
      { path: "groupId" },
    ]);

    // Retrieve the last added message
    const newMessage = savedDoc.messages[savedDoc.messages.length - 1];
    if (!newMessage) {
      return res.status(500).json({ error: "Failed to retrieve the new message." });
    }

    // Determine users to notify
    let newUserIds = [];
    if (savedDoc?.groupId?.userId !== senderId) {
      newUserIds.push(savedDoc.groupId.userId);
    }

    if (Array.isArray(savedDoc?.groupId?.userIds)) {
      savedDoc.groupId.userIds.forEach((item) => {
        if (item?.userId && item?.status === "approved" && item.userId !== senderId) {
          newUserIds.push(item.userId);
        }
      });
    }

    // Fetch FCM tokens for notification
    const fcmTokens = await FcmToken.find({
      userId: { $in: newUserIds },
      deviceType: "Android",
    });

    const tokens = fcmTokens.map((tokenDoc) => tokenDoc.fcmToken).filter(Boolean);

    // Prepare response
    const response = {
      fullname: newMessage.senderId?.fullname || "",
      content: newMessage.content || "",
      image: newMessage.image || "",
      video: newMessage.video || "",
      document: newMessage.document || "",
      timestamp: newMessage.timestamp || new Date(),
      _id: newMessage._id,
      groupId,
      senderId,
      userIds: newUserIds,
    };
    
    // Send notifications if tokens exist
    
    await sendPushNotificationsCreateMessage({
      title: savedDoc?.groupId?.name || "New Message",
      message: newMessage.content || "You have a new message",
        response,
      userTokens: tokens,
    });
    console.log(tokens,'tttttttttttttt')
        console.log("Notification sent successfully.");
  

    // Respond with the created message
    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating message:", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};




// exports.getMessages = async (req, res) => {
//   try {
//     // Find the document for the given groupId (chatId)
//     const messageDoc = await Message.findOne({ groupId: req.params.groupId }).populate('messages.senderId','fullname profileImage');

//     if (!messageDoc) {
//       return res.status(404).json({ error: 'Messages not found' });
//     }

//     // Return the messages array from the document
//     res.status(200).json(messageDoc.messages);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

exports.getMessages = async (req, res) => {
  try {
    const { search } = req.query; // Extract the optional `search` query parameter

    // Find the document for the given groupId
    const messageDoc = await Message.findOne({ groupId: req.params.groupId }).populate(
      'messages.senderId',
      'fullname profileImage'
    );

    if (!messageDoc) {
      return res.status(404).json({ error: 'Messages not found' });
    }

    // Filter messages based on the search query, if provided
    let filteredMessages = messageDoc.messages;

    if (search) {
      const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
      filteredMessages = filteredMessages.filter((message) => searchRegex.test(message.content));
    }

    // Return the filtered messages array (or the original array if no search)
    res.status(200).json(filteredMessages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
