const chatModel = require('../models/chatModel');

// Get Chat Page
function getChatPage(req, res, next) {
	if (req.user.privilege === 'guest') res.render('chat', { reqUser: req.user });
	else {
		const users = chatModel.getChatlessUsers(req.user.username);
		const chats = chatModel.getAllChats(req.user.username);
		Promise.all([users, chats])
			.then((values) => {
				res.render('chat', { reqUser: req.user, users: values[0], chats: values[1] });
			})
			.catch((error) => {
				res.status(500).render('error', { reqUser: req.user, error: 'Failed to retrieve chats', message: error });
			});
	}
}

// Retrieve all chats (That are active / exist)
function getAllChats(req, res, next) {
	chatModel
		.getAllChats(req.user.username)
		.then((result) => {
			res.json(chats);
		})
		.catch((error) => {
			console.error('Error retrieving chats:', error);
			res.status(500).render('error', { reqUser: req.user, error: 'Failed to retrieve chats', message: error });
		});
}

// Retrieve all users that are not in a chat (with the requesting user)
function getChatlessUsers(req, res, next) {
	if (!req.body.username) {
		req.body.username = req.user.username;
	}
	chatModel
		.getChatlessUsers(req.body.username)
		.then((result) => {
			res.json(result);
		})
		.catch((error) => {
			console.error('Error retrieving chatless users:', error);
			res.status(500).render('error', { reqUser: req.user, error: 'Failed to retrieve chatless users', message: error });
		});
}

// Create a new chat
function createChat(req, res, next) {
	const { user1, user2 } = req.body;

	chatModel
		.createChat(user1, user2)
		.then((result) => {
			res.json({ chat: result });
		})
		.catch((error) => {
			console.error('Error creating chat:', error);
			res.status(500).render('error', { reqUser: req.user, error: 'Failed to create chat', message: error });
		});
}

// Delete a chat
function deleteChat(req, res, next) {
	const chatId = req.params.chatId;

	chatModel
		.deleteChat(chatId)
		.then((result) => {
			res.json({ success: true });
		})
		.catch((error) => {
			console.error('Error deleting chat:', error);
			res.status(500).render('error', { reqUser: req.user, error: 'Failed to delete chat', message: error });
		});
}

module.exports = {
	getChatPage,
	getAllChats,
	getChatlessUsers,
	createChat,
	deleteChat,
};
