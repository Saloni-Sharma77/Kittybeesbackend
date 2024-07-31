const Chat = require('../../schema/chatSchema');

exports.createChat = async (req, res) => {
  try {
    const chat = new Chat({ participants: req.body.participants });
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find().populate('participants');
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
