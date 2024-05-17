const db = require('../services/database').config;

/**
 * Create a message x in a chat y from sender z
 * @param {int} chatId id of chat to create message in
 * @param {string} sender Username of the sender
 * @param {string} message Message to send
 * @returns return a message object (id, chatId, sender, message)
 */
let createMessage = (chatId, sender, message) =>
	new Promise((resolve, reject) => {
		db.query('INSERT INTO message (chat_id, sender, message) VALUES (?, ?, ?)', [chatId, sender, message], (error, result) => {
			if (error) {
				reject(error);
			} else {
				const createdMessage = {
					id: result.insertId,
					chatId,
					sender,
					message,
				};
				resolve(createdMessage);
			}
		});
	});

/**
 * Delete a message x in a chat y
 * @param {int} chatId id of chat to delete message in
 * @param {int} messageId id of message to delete
 * @returns return a message object (id, chatId, sender, message)
 */
let deleteMessage = (chatId, messageId) =>
	new Promise((resolve, reject) => {
		const request = 'DELETE FROM message WHERE id = ' + messageId + ' AND chat_id = ' + chatId;
		db.query('DELETE FROM message WHERE id = ? AND chat_id = ?', [messageId, chatId], (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});

/**
 * Get all messages in a chat
 * @param {int} chatId id of chat to get messages from
 * @returns returns the messages in a chat
 */
let getMessages = (chatId) =>
	new Promise((resolve, reject) => {
		db.query('SELECT * FROM message WHERE chat_id = ?', [chatId], (error, messages) => {
			if (error) {
				reject(error);
			} else {
				resolve(messages);
			}
		});
	});

module.exports = {
	createMessage,
	deleteMessage,
	getMessages,
};
