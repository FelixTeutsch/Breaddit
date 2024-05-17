const db = require('../services/database').config;

/**
 * Get all the chats a user is in
 * @param {*} username Username to get the chats to
 * @returns returns all chats for a given user
 */
let getAllChats = (username) =>
	new Promise((resolve, reject) => {
		const query = `
		SELECT c.*, m.sender, m.message, m.timestamp AS last_message_timestamp
		FROM chat c
		LEFT JOIN (
		SELECT chat_id, sender, message, timestamp
		FROM message
		WHERE (chat_id, timestamp) IN (
			SELECT chat_id, MAX(timestamp)
			FROM message
			GROUP BY chat_id
		)
		) m ON c.id = m.chat_id
		WHERE c.user1 = ${db.escape(username)} OR c.user2 = ${db.escape(username)};
        `;

		db.query(query, (error, chats) => {
			if (error) {
				reject(error);
			} else {
				resolve(chats);
			}
		});
	});

/**
 * Get all the users that a user can chat with, but is not jet chatting with
 * @param {*} username Username to get the chatless users to
 * @returns returns all users that a user can chat with, but is not jet chatting with
 */
let getChatlessUsers = (username) =>
	new Promise((resolve, reject) => {
		const request = `Select * FROM user
        WHERE username != ${db.escape(username)} AND username NOT IN 
            (SELECT user1
                FROM chat
                WHERE user2 = ${db.escape(username)}
                )
                AND username NOT IN (
                    SELECT user2 FROM chat WHERE user1 = ${db.escape(username)}
                    ) ORDER BY username ASC`;
		db.query(request, (error, users) => {
			if (error) {
				reject(error);
			} else {
				resolve(users);
			}
		});
	});

/**
 * Create a chat between user1 and user2
 * @param {*} user1 User 1
 * @param {*} user2 User 2
 * @returns Chat between user1 and user2 (id and users)
 */
let createChat = (user1, user2) =>
	new Promise((resolve, reject) => {
		db.query('INSERT INTO chat (user1, user2) VALUES (?, ?)', [user1, user2], (error, result) => {
			if (error) {
				reject(error);
			} else {
				const chat = {
					id: result.insertId,
					user1,
					user2,
				};
				resolve(chat);
			}
		});
	});

/**
 * Delete a chat
 * @param {*} chatId Chat to delete
 * @returns result of sql request (affectedRows and so on)
 */
let deleteChat = (chatId) =>
	new Promise((resolve, reject) => {
		db.query('DELETE FROM chat WHERE id = ?', chatId, (error, result) => {
			if (error) reject(error);
			else resolve(result);
		});
	});

module.exports = {
	getAllChats,
	getChatlessUsers,
	createChat,
	deleteChat,
};
