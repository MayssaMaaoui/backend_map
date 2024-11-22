const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Route to fetch messages
router.get('/messages/:userId', chatController.getMessages);

// Route to send a message
router.post('/messages', chatController.sendMessage);
router.put('/messages/:messageId', chatController.markAsSeen);

module.exports = router;
