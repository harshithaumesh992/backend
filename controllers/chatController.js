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
  const chat = await Chat.findById(req.params.id);
  res.json(chat.messages);
};

exports.sendMessage = async (req, res) => {
  const { sender, senderName, text } = req.body;

  const chat = await Chat.findById(req.params.id);

  chat.messages.push({
    sender,
    senderName,
    text
  });

  await chat.save();

  res.json(chat);
};