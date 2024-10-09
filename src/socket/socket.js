// const Message = require('../schema/messageSchema'); // Import the Message schema

// module.exports = (io) => {
//   io.on('connection', (socket) => {
//     console.log('New client connected:', socket.id);

//     // Join a group room
//     socket.on('joinGroup', (groupId) => {
//       socket.join(groupId);
//       console.log(`User joined group: ${groupId}`);
//     });

//     // Listen for a message event
//     socket.on('sendMessage', async (data) => {
//       const { groupId, senderId, content, image, video, document } = data;

//       try {
//         // Create a new message object
//         const newMessageData = { senderId, content, image, video, document };

//         // Ensure at least one of content, image, or video is provided
//         if (!newMessageData.content && !newMessageData.image && !newMessageData.video && !newMessageData.document) {
//           return socket.emit('error', { error: 'At least one of content, image, video, or document must be provided' });
//         }

//         // Find or create the message document by groupId
//         let messageDoc = await Message.findOne({ groupId });

//         if (!messageDoc) {
//           messageDoc = new Message({
//             groupId,
//             messages: [newMessageData]
//           });
//         } else {
//           messageDoc.messages.push(newMessageData);
//         }

//         // Save the message document
//         await messageDoc.save();

//         // Populate senderId details for the new message
//         await messageDoc.populate('messages.senderId', 'fullname');

//         // Get the last message added to the array
//         const newMessage = messageDoc.messages[messageDoc.messages.length - 1];

//         // Create a response object
//         const response = {
//           fullname: newMessage.senderId.fullname,
//           content: newMessage.content || '',
//           image: newMessage.image || '',
//           video: newMessage.video || '',
//           document: newMessage.document || '',
//           timestamp: newMessage.timestamp,
//           _id: newMessage._id
//         };

//         // Broadcast the new message to everyone in the group
//         io.to(groupId).emit('receiveMessage', response);
//       } catch (error) {
//         console.error("Error sending message:", error);
//         socket.emit('error', { error: 'Failed to send message' });
//       }
//     });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//       console.log('Client disconnected:', socket.id);
//     });
//   });
// };
// src/socket/socket.js
const WebSocket = require('ws');
const Message = require('../schema/messageSchema'); // Import the Message schema

// Function to handle WebSocket connections
module.exports = (wss) => {
  const clients = new Map();

  wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message); // Parse the incoming message

        switch (data.type) {
          case 'joinGroup':
            const { groupId, senderId, fullname } = data; // Extract data
            console.log(`${fullname} joined group: ${groupId}`);

            if (!clients.has(groupId)) {
              clients.set(groupId, new Set()); // Create a new Set for groupId if it doesn't exist
            }
            clients.get(groupId).add(ws); // Add the client to the group
            break;

          case 'sendMessage':
            const { groupId: groupIdSend, senderId: senderIdSend, content, image, video, document } = data;

            // Ensure at least one of content, image, video, or document is provided
            if (!content && !image && !video && !document) {
              ws.send(JSON.stringify({ error: 'At least one of content, image, video, or document must be provided' }));
              return;
            }

            // Create a new message object
            const newMessageData = {
              senderId: senderIdSend,
              content,
              image,
              video,
              document,
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
              _id: newMessage._id
            };

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
