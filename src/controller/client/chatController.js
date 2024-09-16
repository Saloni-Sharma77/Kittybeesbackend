const Chat = require('../../schema/chatSchema');

exports.createChat = async (req, res) => {
  try {
    const { participants, type } = req.body;

    // Validation for chat type and participants
    if (type === 'personal' && participants.length !== 2) {
      return res.status(400).json({ error: 'Personal chat must have exactly two participants.' });
    }
    if (type === 'group' && participants.length < 2) {
      return res.status(400).json({ error: 'Group chat must have at least two participants.' });
    }

    const chat = new Chat({ participants, type });
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
