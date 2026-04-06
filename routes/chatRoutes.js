const express = require("express");
const router = express.Router();
const controller = require("../controllers/chatController");

router.get("/", controller.getConversations);
router.get("/:id/messages", controller.getMessages);
router.post("/:id/message", controller.sendMessage);

module.exports = router;