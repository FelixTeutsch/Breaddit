const db = require('../services/database').config;

/**
 * @deprecated this is not in use. It's functionality has been implemented in other functions
 * @param {int} post_id Id of post to get likes from
 * @returns number of likes as likes
 */
let getLikes = (post_id) =>
	new Promise(async (resolve, reject) => {
		let request = "SELECT COUNT(user) as 'likes' FROM `like` WHERE " + post_id;
		db.query(request, (error, result) => {
			if (error) reject(error);
			else resolve(result);
		});
	});

/**
 * Like a post
 * @param {string} user Username of user liking the post
 * @param {int} post_id Id of post to like
 * @returns Query result
 */
let likePost = (user, post_id) =>
	new Promise((resolve, reject) => {
		let insert = 'INSERT INTO `like` (user, P_ID) VALUES (' + db.escape(user) + ', ' + db.escape(post_id) + ');';
		db.query(insert, (error, result) => {
			if (error) reject(error);
			else resolve(result);
		});
	});

/**
 * Remove a like from a liked post
 * @param {string} user Username of user liking the post
 * @param {int} post_id Id of post to like
 * @returns Query result
 */
let likeRemove = (user, post_id) =>
	new Promise((resolve, reject) => {
		let remove = 'DELETE FROM `like` WHERE user = ' + db.escape(user) + ' AND P_ID = ' + db.escape(post_id) + ';';
		db.query(remove, (error, result) => {
			if (error) reject(error);
			else resolve(result);
		});
	});

/**
 * Check if user x has liked post y
 * @param {string} user Username of user to check if liked
 * @param {int} post_id Id of post to check if liked
 * @returns if user has liked or not (true/false)
 */
let hasLiked = (user, post_id) =>
	new Promise((resolve, reject) => {
		let select = 'SELECT * FROM `like` WHERE user = ' + db.escape(user) + ' AND P_ID = ' + post_id + ';';
		db.query(select, (error, result) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(result.length === 1);
		});
	});

module.exports = {
	getLikes,
	likePost,
	hasLiked,
	likeRemove,
};
