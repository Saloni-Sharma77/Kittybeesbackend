const Message = require('../schema/messageSchema');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('join chat', (chatId) => {
      socket.join(chatId);
    });

    socket.on('chat message', async (data) => {
      const { chatId, sender, content } = data;
      const message = new Message({ chatId, sender, content });
      await message.save();
      io.to(chatId).emit('chat message', message);
    });
  });
};

module.exports = socketHandler;
