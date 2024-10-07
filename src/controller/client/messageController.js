const Message = require('../../schema/messageSchema');

exports.createMessage = async (req, res) => {
  try {
    const { groupId, senderId, content } = req.body;

    // Find the message document by groupId
    let messageDoc = await Message.findOne({ groupId });

    if (!messageDoc) {
      // If no document exists for this groupId, create a new one
      messageDoc = new Message({
        groupId,
        messages: [{ senderId, content }] // Add the message to the messages array
      });
    } else {
      // If the document exists, push the new message to the messages array
      messageDoc.messages.push({ senderId, content });
    }

    // Save the document (either newly created or updated)
    await messageDoc.save();

    res.status(201).json(messageDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    // Find the document for the given groupId (chatId)
    const messageDoc = await Message.findOne({ groupId: req.params.groupId }).populate('messages.senderId');

    if (!messageDoc) {
      return res.status(404).json({ error: 'Messages not found' });
    }

    // Return the messages array from the document
    res.status(200).json(messageDoc.messages);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};