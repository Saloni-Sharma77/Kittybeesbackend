const Message = require('../../schema/messageSchema');

exports.createMessage = async (req, res) => {
  try {
    const message = new Message({
      chatId: req.body.chatId,
      sender: req.body.sender,
      content: req.body.content
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).populate('sender');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
