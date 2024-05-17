const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const messageController = require('../controllers/messageController');

// Get chat page
router.get('/', chatController.getChatPage);

// Retrieve all chats
router.get('/get', chatController.getAllChats);

// Retrieve all usrers without chats (with user)
router.route('/getChatlessUsers').get(chatController.getChatlessUsers).post(chatController.getChatlessUsers);

// Create a new chat
router.post('/create', chatController.createChat);

// Get Messages, Create Messages, Delete a chat
router.route('/:chatId').get(messageController.getMessages).post(messageController.createMessage).delete(chatController.deleteChat);

// Delete a message in a chat
router.delete('/:chatId/messages/:messageId', messageController.deleteMessage);

module.exports = router;
