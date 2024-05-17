const db = require('../services/database').config;

/**
 * Retrieves the followers of a user.
 *
 * @param {string} username - The username of the user to get followers for.
 * @returns {Promise<Array>} A promise that resolves to an array of follower usernames.
 */
let getFollower = (username) =>
	new Promise(async (resolve, reject) => {
		let request = 'SELECT follower FROM `follower_following` WHERE following = ' + db.escape(username);
		db.query(request, function (error, result) {
			if (error) reject(error);
			else resolve(result);
		});
	});

/**
 * Retrieves the users being followed by a user.
 *
 * @param {string} username - The username of the user to get following users for.
 * @returns {Promise<Array>} A promise that resolves to an array of following usernames.
 */
let getFollowing = (username) =>
	new Promise(async (resolve, reject) => {
		let request = 'SELECT following FROM `follower_following` WHERE follower = ' + db.escape(username);
		db.query(request, function (error, result) {
			if (error) reject(error);
			else resolve(result);
		});
	});

/**
 * Checks if a user is following another user.
 *
 * @param {string} follower - The username of the follower.
 * @param {string} following - The username of the user being followed.
 * @returns {Promise<Array>} A promise that resolves to the result of the check.
 */
let isFollowing = (follower, following) =>
	new Promise(async (resolve, reject) => {
		let request = 'SELECT * FROM `follower_following` WHERE follower = ' + db.escape(follower) + ' AND following = ' + db.escape(following);
		db.query(request, function (error, result) {
			if (error) reject(error);
			else resolve(result);
		});
	});

/**
 * Makes a user follow another user.
 *
 * @param {string} follower - The username of the follower.
 * @param {string} following - The username of the user to follow.
 * @returns {Promise<object>} A promise that resolves to the result of the follow operation.
 */
let followUser = (follower, following) =>
	new Promise(async (resolve, reject) => {
		let request = 'INSERT INTO `follower_following`(`follower`, `following`) VALUES (' + db.escape(follower) + ',' + db.escape(following) + ')';
		db.query(request, function (error, result) {
			if (error) reject(error);
			else resolve(result);
		});
	});

/**
 * Makes a user unfollow another user.
 *
 * @param {string} follower - The username of the follower.
 * @param {string} following - The username of the user to unfollow.
 * @returns {Promise<object>} A promise that resolves to the result of the unfollow operation.
 */
let unfollowUser = (follower, following) =>
	new Promise(async (resolve, reject) => {
		console.log('Unfollowing ', follower, following);
		let request = 'DELETE FROM `follower_following` WHERE follower = ' + db.escape(follower) + ' AND following = ' + db.escape(following);
		console.log('Unfollow request: ' + request);
		db.query(request, function (error, result) {
			if (error) reject(error);
			else resolve(result);
		});
	});

module.exports = {
	getFollower,
	getFollowing,
	isFollowing,
	followUser,
	unfollowUser,
};
