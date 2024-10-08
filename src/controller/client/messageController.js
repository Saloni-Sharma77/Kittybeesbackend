const Message = require('../../schema/messageSchema');

exports.createMessage = async (req, res) => {
  try {
    // Destructure only groupId and senderId
    const { groupId, senderId } = req.body;

    // Initialize message data object
    const newMessageData = { senderId };

    // Check and add content if provided
    if (req.body.content) {
      newMessageData.content = req.body.content;
    }
    if (req.body.document) {
      newMessageData.document = req.body.document;
    }

    // Check and add image if provided
    if (req.body.image) {
      newMessageData.image = req.body.image;
    }

    // Check and add video if provided
    if (req.body.video) {
      newMessageData.video = req.body.video;
    }

    // Ensure at least one of content, image, or video is provided
    if (!newMessageData.content && !newMessageData.image && !newMessageData.video && !newMessageData.document) {
      return res.status(400).json({ error: 'At least one of content,document, image, or video must be provided' });
    }

    // Find the message document by groupId
    let messageDoc = await Message.findOne({ groupId });

    if (!messageDoc) {
      // If no document exists for this groupId, create a new one
      messageDoc = new Message({
        groupId,
        messages: [newMessageData] // Add the new message to the messages array
      });
    } else {
      // If the document exists, push the new message to the messages array
      messageDoc.messages.push(newMessageData);
    }

    // Save the document (either newly created or updated)
    await messageDoc.save();

    // Populate senderId details for the new message
    await messageDoc.populate('messages.senderId', 'fullname');

    // Get the last message added to the array
    const newMessage = messageDoc.messages[messageDoc.messages.length - 1];

    // Create a response object with required fields
    const response = {
      fullname: newMessage.senderId.fullname,
      content: newMessage.content || '',
      image: newMessage.image || '',
      video: newMessage.video || '',
      document:newMessage.document || '',
      timestamp: newMessage.timestamp,
      _id:newMessage._id
    };

    res.status(201).json(response); // Return only the new message details
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.getMessages = async (req, res) => {
  try {
    // Find the document for the given groupId (chatId)
    const messageDoc = await Message.findOne({ groupId: req.params.groupId }).populate('messages.senderId','fullname profileImage');

    if (!messageDoc) {
      return res.status(404).json({ error: 'Messages not found' });
    }

    // Return the messages array from the document
    res.status(200).json(messageDoc.messages);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};