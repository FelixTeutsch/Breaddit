const messageModel = require('../models/messageModel');

// Get all messages in a chat
function getMessages(req, res, next) {
	const chatId = req.params.chatId;
	messageModel
		.getMessages(chatId)
		.then((messages) => {
			res.json({ messages: messages });
		})
		.catch((error) => {
			console.error('Error retrieving messages:', error);
			res.status(500).render('error', { reqUser: req.user, error: 'Failed to retrieve messages', message: error });
		});
}

// Create a message in a chat
function createMessage(req, res, next) {
	const chatId = req.params.chatId;
	const { sender, message } = req.body;

	messageModel
		.createMessage(chatId, sender, message)
		.then((result) => {
			res.json({ messageId: createdMessage.id });
		})
		.catch((error) => {
			console.error('Error creating message:', error);
			res.status(500).render('error', { reqUser: req.user, error: 'Failed to create message', message: error });
		});
}

// Delete a message in a chat
function deleteMessage(req, res, next) {
	const chatId = req.params.chatId;
	const messageId = req.params.messageId;

	messageModel
		.deleteMessage(chatId, messageId)
		.then((result) => {
			res.json({ success: true });
		})
		.catch((error) => {
			console.error('Error deleting message:', error);
			res.status(500).render('error', { reqUser: req.user, error: 'Failed to delete message', message: error });
		});
}

module.exports = {
	getMessages,
	createMessage,
	deleteMessage,
};
