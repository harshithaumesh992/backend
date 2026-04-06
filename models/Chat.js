const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: String,
  senderName: String,
  text: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  userId: String,
  userName: String,

  messages: [messageSchema],

  unreadCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Chat", chatSchema);