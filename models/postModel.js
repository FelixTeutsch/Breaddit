const db = require('../services/database').config;
const { v5: uuidv5 } = require('uuid');
const path = require('path');
const fs = require('fs');
const { fileLoader } = require('ejs');

/**
 * Save a post locally (in the folder /post/)
 * Post get's renamed to username_UUID.filetype
 * @param {string} username Username of the user who wants to save the post
 * @param {file} post The post to be saved
 * @param {string} filetype Filetype of the post (ex. jpg, png, etc.)
 * @returns The filename of the saved post (uuid)
 */
let savePostLocally = (username, post, filetype) =>
	new Promise((resolve, reject) => {
		// Generate a UUID using the function getUuid(username)
		const uuid = getUuid(username);

		// Save the post in the Location /posts/username_UUID.jpg
		const filename = `${username}_${uuid}.${filetype}`;
		const filepath = `../post/${filename}`;

		post.mv(path.join(__dirname, filepath), (error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(filename);
		});
	});

/**
 * Check if a user can view a post
 * @param {string} username Username of the user who wants to view the post
 * @param {string} filename Filename of the post
 * @returns if the user can view the post or not (true/false)
 */
let canViewPost = (username, filename) =>
	new Promise((resolve, reject) => {
		// let request = 'SELECT IF(COUNT(f.follower) = 1, TRUE, FALSE) as `result`, p.creator as `creator`' + 'FROM post AS p RIGHT JOIN follower_following AS f on p.creator = f.following ' + 'WHERE p.image_location = ' + db.escape(filename) + ' AND (f.follower = ' + db.escape(username) + ' OR p.creator = ' + db.escape(username) + ');';
		let request = 'SELECT p.creator AS `creator` FROM post AS p LEFT JOIN follower_following AS f ON p.creator = f.following WHERE p.image_location = ' + db.escape(filename) + ' AND( f.follower = ' + db.escape(username) + ' OR p.creator = ' + db.escape(username) + ' );';
		console.log(request);
		db.query(request, function (error, result) {
			if (error) reject(error);
			else resolve(result.length > 0);
		});
	});

/**
 * Function to get the location of a file of
 * @param {string} filename Name of the file to get the location of
 * @returns the location of the file
 * @deprecated not needed anymore
 */
let getFileLocation = (filename) =>
	new Promise((resolve, reject) => {
		const options = {
			root: path.join(__dirname, '../post/'),
		};
		const filePath = path.join(__dirname, '../public/', filename);

		// Check if the file exists
		fs.access(filePath, fs.constants.F_OK, (error) => {
			if (error) reject(error);
			else resolve(filename, options);
			// File exists, send it
		});
	});

// Function to generate a UUID using username and a predetermined namespace
/**
 * Generates a UUID using a username, the time of creation and a predetermined namespace
 * @param {string} username Username to generate the UUID from
 * @param {string} namespace Namespace to generate the UUID from (default: 1b671a64-40d5-491e-99b0-da01ff1f3341)
 * @returns the generated UUID
 */
function getUuid(username, namespace = '1b671a64-40d5-491e-99b0-da01ff1f3341') {
	username = username + Date.now();
	return uuidv5(username, namespace);
}

/**
 * Save a post to the database
 * @param {string} username Username of the user who wants to save the post
 * @param {string} filename Filename of the post
 * @param {string} caption Caption of the post
 * @returns the result of the query
 */
let savePostToDatabase = (username, filename, caption) =>
	new Promise((resolve, reject) => {
		let request = 'INSERT INTO `post` (`creator`, `image_location`, `caption`) VALUES (?, ?, ?)';
		db.query(request, [username, filename, caption], (error, result) => {
			if (error) reject(error);
			else resolve(result);
		});
	});

/**
 * Get all posts from the database
 * @param {string} username Username of the user who wants to get all posts
 * @returns all posts from the database
 */
let getPostsUser = (username) =>
	new Promise((resolve, reject) => {
		let request = 'SELECT p.P_ID, p.image_location, p.caption, p.creator, u.firstname, u.surname, u.status, COUNT(l.user) as `likes`' + ' FROM post AS p LEFT JOIN `user` AS u ON p.creator = u.username LEFT JOIN `like` AS l ON p.P_ID = l.P_ID' + ' WHERE p.creator = ' + db.escape(username) + ' GROUP BY p.P_ID;';
		db.query(request, (error, result) => {
			if (error) reject(error);
			else resolve(result);
		});
	});

/**
 * Get all posts from the users followers
 * @param {string} username Username of the user who wants to get all posts
 * @returns all posts from the database
 */
let getFeedUser = (username) =>
	new Promise((resolve, reject) => {
		let request = 'SELECT p.P_ID, p.image_location, p.caption, p.creator, u.firstname, u.surname, u.status, COUNT(l.user) as `likes`' + ' FROM post AS p LEFT JOIN `user` AS u ON p.creator = u.username LEFT JOIN `like` AS l ON p.P_ID = l.P_ID LEFT JOIN follower_following AS ff ON ff.following = p.creator' + ' WHERE ff.follower = ' + db.escape(username) + ' GROUP BY p.P_ID;';

		db.query(request, (error, result) => {
			if (error) reject(error);
			else resolve(result);
		});
	});

module.exports = {
	savePostLocally,
	canViewPost,
	getFileLocation,
	savePostToDatabase,
	getPostsUser,
	getFeedUser,
};
