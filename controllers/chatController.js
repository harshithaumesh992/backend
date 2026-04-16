const Chat = require("../models/Chat");

exports.getConversations = async (req, res) => {
  try {
    console.log('Fetching conversations...');
    const chats = await Chat.find();
    console.log(`Found ${chats.length} conversations`);
    res.json(chats);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    res.json(chat.messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { sender, senderName, text } = req.body;
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    chat.messages.push({
      sender,
      senderName,
      text
    });

    await chat.save();
    res.json(chat);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};