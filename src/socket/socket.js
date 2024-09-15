const Message = require('../schema/messageSchema');

const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('join chat', (chatId) => {
            socket.join(chatId);
        });

        socket.on('chat message', async (data) => {
            const { chatId, sender, content } = data;
            const message = new Message({ chatId, sender, content });
            try {
                await message.save();
                io.to(chatId).emit('chat message', message);
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });
    });
};

module.exports = socketHandler;
