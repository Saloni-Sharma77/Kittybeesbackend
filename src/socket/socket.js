const WebSocket = require('ws');
const Message = require('../schema/messageSchema'); // Import the Message schema
const User = require('../schema/userSchema'); // Make sure to import your User model

module.exports = (wss) => {
  // const clients = new Map();
    const clients = new Map(); 
 global.clients = clients;

  wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message); // Parse the incoming message
        console.log(data,'ddddddddddddddddddddddddd')
        
        switch (data.type) {
          case 'joinGroup':
            const { groupId, senderId, fullname } = data; // Extract data
            console.log(`${fullname} joined group: ${groupId}`);

            if (!clients.has(groupId)) {
              clients.set(groupId, new Set()); // Create a new Set for groupId if it doesn't exist
            }
            clients.get(groupId).add(ws); // Add the client to the group
            break;

            // Utility to extract @mentions from content
            const extractMentions = (text) => {
              const regex = /@([\w\s]+)/g; // matches @Full Name with spaces
              const mentions = [];
              let match;
              while ((match = regex.exec(text)) !== null) {
                mentions.push(match[1].trim());
              }
              return mentions;
            }

          case 'sendMessage':
            const { groupId: groupIdSend, senderId: senderIdSend, content, image, video, document,pollOptions,message } = data;
            

            // Ensure at least one of content, image, video, or document and poll options is provided
            if (!content && !image && !video && !document && !pollOptions) {
              ws.send(JSON.stringify({ error: 'At least one of content, image, video, document and poll options must be provided' }));
              return;
            }

              // 🧠 Extract mentions from the content
            const mentionedFullnames = extractMentions(content || "");
            const mentionedUsers = await User.find({ fullname: { $in: mentionedFullnames } }).select("_id fullname");
            const mentionedUserIds = mentionedUsers.map(u => u._id.toString());



            // Create a new message object
            const newMessageData = {
              senderId: senderIdSend,
              content,
              image,
              video,
              document,
              pollOptions,
              mentions: mentionedUserIds,  // 💡 Store mentioned user IDs if your schema supports it
              timestamp: new Date() // Add timestamp here
            };

            // Find or create the message document by groupId
            let messageDoc = await Message.findOne({ groupId: groupIdSend });

            if (!messageDoc) {
              messageDoc = new Message({
                groupId: groupIdSend,
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
              type: 'receiveMessage',
              fullname: newMessage.senderId.fullname,
              content: newMessage.content || '',
              image: newMessage.image || '',
              video: newMessage.video || '',
              document: newMessage.document || '',
              timestamp: newMessage.timestamp,
              pollOptions: newMessage.pollOptions || null,
              mentions: mentionedUserIds,
              _id: newMessage._id
            };


            if (message && message.trim() !== '') {
      response.message = message;
    }
 
            // Broadcast the new message to everyone in the group
            clients.get(groupIdSend).forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(response));
              }
            });
            break;

          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error("Error processing message:", error);
        ws.send(JSON.stringify({ error: 'Failed to process message' }));
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      // Remove the client from all groups
      clients.forEach((groupClients, groupId) => {
        if (groupClients.has(ws)) {
          groupClients.delete(ws);
          console.log(`Client removed from group: ${groupId}`);
          if (groupClients.size === 0) {
            clients.delete(groupId); // Remove the group if empty
          }
        }
      });
    });

    // Send a welcome message to the client
    ws.send(JSON.stringify({ type: 'welcome', message: 'Welcome to the WebSocket server!' }));
  });
};
