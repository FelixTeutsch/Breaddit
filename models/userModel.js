const db = require('../services/database').config;
const bcrypt = require('bcrypt');
const { fileLoader } = require('ejs');
const fs = require('fs');

/**
 * Retrieves all users from the database.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of user objects.
 */
let getUsers = () =>
	new Promise((resolve, reject) => {
		db.query('SELECT * FROM user', function (error, users) {
			if (error) reject(error);
			else resolve(users);
		});
	});

/**
 * Retrieves a user from the database by their username.
 *
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<object>} A promise that resolves to the user object.
 * @throws {string} Throws an error if the user is not found.
 */
let getUser = (username) =>
	new Promise((resolve, reject) => {
		db.query('SELECT * FROM `user` WHERE username = ' + db.escape(username), function (error, user, field) {
			if (error) reject(error);
			else if (Array.isArray(user) && user.length > 0) resolve(user[0]);
			else reject('USER NOT FOUND!');
		});
	});

/**
 * Updates an existing user's information in the database.
 *
 * @param {object} userData - The user data object containing the updated information.
 * @returns {Promise<object>} A promise that resolves to the updated user object.
 */
let updateUser = (userData) =>
	new Promise((resolve, reject) => {
		let sql = 'UPDATE user SET firstname = ' + db.escape(userData.firstname) + ', surname = ' + db.escape(userData.surname) + ', status = ' + db.escape(userData.status) + ' WHERE username = ' + db.escape(userData.username);
		db.query(sql, function (error, user) {
			if (error) reject(error);
			else resolve(user);
		});
	});

/**
 * Deletes a user from the database by their username.
 *
 * @param {string} username - The username of the user to delete.
 * @returns {Promise<object>} A promise that resolves to the result of the delete operation.
 */
let deleteUser = (username) =>
	new Promise((resolve, reject) => {
		db.query('DELETE FROM `user` WHERE username = ' + db.escape(username), function (error, result) {
			if (error) reject(error);
			else resolve(result);
		});
	});

/**
 * Adds a new user to the database.
 *
 * @param {object} userData - The user data object containing information for creating the user.
 * @returns {Promise<object>} A promise that resolves to the result of the add operation.
 */
let addUser = (userData) =>
	new Promise(async (resolve, reject) => {
		let request = 'INSERT INTO `user`(`username`, `firstname`, `surname`, `status`, `password`, `privilege`)' + 'VALUES (' + db.escape(userData.username) + ', ' + db.escape(userData.firstname) + ', ' + db.escape(userData.surname) + ', ' + db.escape(userData.status) + ', ' + db.escape(await hashPassword(userData.password)) + ', ' + db.escape('user') + ')';
		db.query(request, function (error, result) {
			if (error) reject(error);
			else resolve(result);
		});
	});

/**
 * Hash a password with bcrypt and 10 salt rounds.
 * @param {string} password password to hash
 * @returns hashed password
 */
async function hashPassword(password) {
	console.log('Password to hash: ' + password);
	return await bcrypt.hash(password, 10);
}

/**
 * Save a picture locally
 * @param {string} filename Name of the picture ot save
 * @param {file} picture Picture to save
 * @returns nothing
 */
async function savePicture(filename, picture) {
	let path = 'public/images/profile/' + filename + '.jpg';
	console.log('Saving picture to: ' + path);

	fs.writeFile('./public/user/' + filename + '.jpg', picture, function (error) {
		if (error) console.log('Error saving image: ' + error);
		console.log('File saved!');
	});
}

/**
 * Updates a user's profile picture and banner in the database.
 *
 * @param {string} username - The username of the user to update the pictures for.
 * @param {object} pictures - An object containing profile and banner picture data.
 * @returns {Promise<void>} A promise that resolves when the pictures are updated.
 */
let updateUserPicture = (username, { profile, banner }) =>
	new Promise(async (resolve, reject) => {
		if (profile) await savePicture(username + '_profile', profile.data);
		if (banner) await savePicture(username + '_banner', banner.data);
		resolve();
	});

/**
 * Updates a user's password in the database.
 *
 * @param {string} username - The username of the user to update the password for.
 * @param {string} password - The new password for the user.
 * @returns {Promise<object>} A promise that resolves to the result of the password update operation.
 */
let updatePassword = (username, password) =>
	new Promise(async (resolve, reject) => {
		let sql = 'UPDATE user SET password = ' + db.escape(await hashPassword(password)) + ' WHERE username = ' + db.escape(username);
		console.log('Database Request: ' + sql);
		db.query(sql, function (error, user) {
			if (error) reject(error);
			else resolve(user);
		});
	});

/**
 * Validates if a username is available for registration.
 *
 * @param {string} username - The username to validate.
 * @returns {Promise<boolean>} A promise that resolves to true if the username is available, false otherwise.
 */
let validateUsername = (username) =>
	new Promise((resolve, reject) => {
		db.query('SELECT * FROM `user` WHERE `username` = ' + db.escape(username), function (error, result) {
			if (error) reject(error);
			else resolve(result.length === 0);
		});
	});

/**
 * Searches for users in the database based on a search query.
 *
 * @param {string} search - The search query.
 * @returns {Promise<Array>} A promise that resolves to an array of matching user objects.
 */
let searchUsers = (search) =>
	new Promise((resolve, reject) => {
		const request = 'SELECT * FROM `user` WHERE `username` LIKE ' + db.escape('%' + search + '%') + ' OR `firstname` LIKE ' + db.escape('%' + search + '%') + ' OR `surname` LIKE ' + db.escape('%' + search + '%');
		db.query(request, function (error, result) {
			if (error) reject(error);
			else resolve(result);
		});
	});

/**
 * Requests administrator privileges for a user.
 *
 * @param {string} username - The username of the user requesting admin privileges.
 * @returns {Promise<object>} A promise that resolves to the result of the admin request.
 */
let requestAdmin = (username) =>
	new Promise((resolve, reject) => {
		const request = 'UPDATE `user` SET `privilege` = ' + db.escape('admin') + ' WHERE `username` = ' + db.escape(username);
		db.query(request, function (error, result) {
			if (error) reject(error);
			else resolve(result);
		});
	});
module.exports = {
	getUsers,
	getUser,
	updateUser,
	deleteUser,
	addUser,
	updateUserPicture,
	updatePassword,
	validateUsername,
	searchUsers,
	requestAdmin,
};
