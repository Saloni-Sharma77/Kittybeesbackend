const Message = require('../../schema/messageSchema');
const User = require('../../schema/userSchema');
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
    if (req.body.video) newMessageData.video = req.body.video;
    if (req.body.pollOptions) newMessageData.pollOptions = req.body.pollOptions;



    if (req.body.pollOptions) {
      const pollData = req.body.pollOptions;
      const msgPollData = pollData ? {
        question: pollData.question,
        options: pollData.options.map((option) => ({
          optionText: option.optionText,
          votes: option.votes || 0,
        })),
      } : null;

      if (msgPollData) newMessageData.pollOptions = msgPollData;
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
      userId: { $in: newUserIds, $ne: senderId }, 
      deviceType: "Android",
  });
  

    // const tokens = fcmTokens.map((tokenDoc) => tokenDoc.fcmToken).filter(Boolean);
    const tokens = fcmTokens
  .flatMap((tokenDoc) => tokenDoc?.fcmToken) // Flatten nested arrays of tokens
  .filter(Boolean); // Remove null or undefined values

    // Prepare response
    const response = {
      fullname: newMessage.senderId?.fullname || "",
      content: newMessage.content || "",
      image: newMessage.image || "",
      video: newMessage.video || "",
      document: newMessage.document || "",
      timestamp: newMessage.timestamp || new Date(),
      _id: newMessage._id,
      pollOptions:  newMessage?.pollOptions || "",
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
    res.status(200).json(response);
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
    ).populate(
      'messages.pollOptions.options.voters',
      'fullname profileImage'
      
    )

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



//voting starts here

// exports.addVoteToChatPoll = async (req, res) => {
//   try {
//     const { optionId, userId, groupId } = req.body;

//     // Find the message with the specific groupId
//     const pollmsg = await Message.findOne({ 'groupId': groupId });

//     // Find the message that contains the poll
//     const messageWithPoll = pollmsg.messages.find(message =>
//       message.pollOptions && message.pollOptions.options.some(option => option.optionId.toString() === optionId) // Check for the correct optionId
//     );

//     if (!messageWithPoll) {
//       return res.status(404).json({ message: 'Poll not found in the messages' });
//     }

//     // Find the option based on optionId
//     const option = messageWithPoll.pollOptions.options.find(option =>
//       option.optionId.toString() === optionId
//     );

//     if (!option) {
//       return res.status(404).json({ message: 'Option not found' });
//     }

//     // Check if the user already voted
//     const alreadyVotedOption = messageWithPoll.pollOptions.options.find(option =>
//       option.voters.some(voter => voter.toString() === userId)
//     );

//     if (alreadyVotedOption) {
//       if (alreadyVotedOption.optionId.toString() === optionId) {
//         // User is trying to remove their vote from the current option
//         alreadyVotedOption.votes -= 1;
//         alreadyVotedOption.voters = alreadyVotedOption.voters.filter(
//           voter => voter.toString() !== userId
//         );
//       } else {
//         // User has voted for a different option
//         return res.status(400).json({ message: 'You have already voted for another option' });
//       }
//     } else {
//       // User has not voted yet, so add their vote to the selected option
//       option.votes += 1;
//       option.voters.push(userId);
//     }

//     // Save the updated message
//     await pollmsg.save();

//     res.status(200).json({ message: 'Vote updated successfully', pollmsg });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

exports.addVoteToChatPoll = async (req, res) => {
  try {
    const { optionId, userId, groupId ,messageId} = req.body;

    // Find the message with the specific groupId
    const pollmsg = await Message.findOne({ 'groupId': groupId });

    // Find the message that contains the poll
    const messageWithPoll = pollmsg.messages.find(message =>
      message.pollOptions && message.pollOptions.options.some(option => option.optionId.toString() === optionId) // Check for the correct optionId
    );

    if (!messageWithPoll) {
      return res.status(404).json({ message: 'Poll not found in the messages' });
    }

    // Find the option based on optionId
    const option = messageWithPoll.pollOptions.options.find(option =>
      option.optionId.toString() === optionId
    );

    if (!option) {
      return res.status(404).json({ message: 'Option not found' });
    }

    // Check if the user already voted
    const alreadyVotedOption = messageWithPoll.pollOptions.options.find(option =>
      option.voters.some(voter => voter?.toString() === userId)
    );

    if (alreadyVotedOption) {
      if (alreadyVotedOption.optionId?.toString() === optionId) {
        // User is trying to remove their vote from the current option
        alreadyVotedOption.votes -= 1;
        alreadyVotedOption.voters = alreadyVotedOption.voters.filter(
          voter => voter?.toString() !== userId
        );
      } else {
        // User has voted for a different option, so update the vote
        alreadyVotedOption.votes -= 1;
        alreadyVotedOption.voters = alreadyVotedOption.voters.filter(
          voter => voter?.toString() !== userId
        );
        
        // Add the vote to the new option
        option.votes += 1;
        option.voters.push(userId);
      }
    } else {
      // User has not voted yet, so add their vote to the selected option
      option.votes += 1;
      option.voters.push(userId);
    }

    // Save the updated message
    const populatedPollmsg = await pollmsg.populate({
      path: 'messages.pollOptions.options.voters',
      model: User,
      select: 'fullname profileImage' // Select specific fields from the User model (adjust as needed)
    })

    // Save the updated message
    await pollmsg.save();

    res.status(200).json({ message: 'Vote updated successfully', pollmsg: populatedPollmsg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getVotesOnOption = async (req, res) => {
  try {
    const { optionId, groupId } = req.query;  

    const pollmsg = await Message.findOne({ 'groupId': groupId });

    if (!pollmsg) {
      return res.status(404).json({ message: 'Poll message not found' });
    }
    const messageWithPoll = pollmsg.messages.find(message =>
      message.pollOptions && message.pollOptions.options.some(option => option.optionId.toString() === optionId)
    );

    if (!messageWithPoll) {
      return res.status(404).json({ message: 'Poll not found in the messages' });
    }

    const option = messageWithPoll.pollOptions.options.find(option =>
      option.optionId.toString() === optionId
    );

    if (!option) {
      return res.status(404).json({ message: 'Option not found' });
    }

    res.status(200).json({
      message: 'Votes retrieved successfully',
      optionText: option.optionText,
      votes: option.votes,
      voters: option.voters
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//ends here


