const Chat = require("../models/Chat");

exports.getConversations = async (req, res) => {
  const chats = await Chat.find();
  res.json(chats);
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