const Message = require('../schema/memoriesSchema'); // Import the Message schema

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join a group room
    socket.on('joinGroup', (groupId) => {
      socket.join(groupId);
      console.log(`User joined group: ${groupId}`);
    });

    // Listen for a message event
    socket.on('sendMessage', async (data) => {
      const { groupId, senderId, content, image, video, document } = data;

      try {
        // Create a new message object
        const newMessageData = { senderId, content, image, video, document };

        // Ensure at least one of content, image, or video is provided
        if (!newMessageData.content && !newMessageData.image && !newMessageData.video && !newMessageData.document) {
          return socket.emit('error', { error: 'At least one of content, image, video, or document must be provided' });
        }

        // Find or create the message document by groupId
        let messageDoc = await Message.findOne({ groupId });

        if (!messageDoc) {
          messageDoc = new Message({
            groupId,
            messages: [newMessageData]
          });
        } else {
          messageDoc.messages.push(newMessageData);
        }

        // Save the message document
        await messageDoc.save();

        // Populate senderId details for the new message
        await messageDoc.populate('messages.senderId', 'fullname');

        // Get the last message added to the array
        const newMessage = messageDoc.messages[messageDoc.messages.length - 1];

        // Create a response object
        const response = {
          fullname: newMessage.senderId.fullname,
          content: newMessage.content || '',
          image: newMessage.image || '',
          video: newMessage.video || '',
          document: newMessage.document || '',
          timestamp: newMessage.timestamp,
          _id: newMessage._id
        };

        // Broadcast the new message to everyone in the group
        io.to(groupId).emit('receiveMessage', response);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit('error', { error: 'Failed to send message' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
