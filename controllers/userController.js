const userModel = require('../models/userModel');
const followModel = require('../models/followModel');
const postModel = require('../models/postModel');
const { createJWT } = require('../services/authentication');
const bcrypt = require('bcrypt');

// Delete user
function deleteUser(req, res, next) {
	try {
		const reqUsername = req.user.username;
		const userUsername = req.params.username;
		if (reqUsername == userUsername) {
			userModel.deleteUser(userUsername);
			res.redirect('/logout');
		} else {
			res.status(403);
			next(new Error('You are not allowed to delete this user'));
		}
	} catch (error) {
		res.status(500);
		next(error);
	}
}

// Retrieves all users and renders them in a view.
function getUsers(req, res, next) {
	userModel
		.getUsers()
		.then((users) => res.render('user/users', { reqUser: req.user, users: users }))
		.catch((error) => res.status(500).render('error', { reqUser: req.user, error }));
}

// Retrieves a single user and renders them in a view.
async function getUser(req, res, next) {
	try {
		const reqUsername = req.user.username;
		const userUsername = req.params.username;

		const [isFollowing, user, posts, follower, following] = await Promise.all([followModel.isFollowing(reqUsername, userUsername), userModel.getUser(req.params.username), postModel.getPostsUser(userUsername), followModel.getFollower(userUsername), followModel.getFollowing(userUsername)]);

		res.render(isFollowing.length === 1 || reqUsername == userUsername || req.user.privilege === 'admin' ? 'user/user' : 'user/userNotFollowing', { reqUser: req.user, user, posts, follower, following, isFollowing: isFollowing.length === 1 });
	} catch (error) {
		res.status(500);
		next(error);
	}
}

// Follow a user
function followUser(req, res, next) {
	try {
		const reqUsername = req.user.username;
		followModel.followUser(reqUsername, req.params.username);
		res.redirect('/users/' + req.params.username);
	} catch (error) {
		res.status(500);
		next(error);
	}
}

// Unfollow a user
function unfollowUser(req, res, next) {
	try {
		const reqUsername = req.user.username;
		followModel.unfollowUser(reqUsername, req.params.username);
		res.redirect('/users/' + req.params.username);
	} catch (error) {
		res.status(500);
		next(error);
	}
}

// Get Follower
function getFollower(req, res, next) {
	followModel.getFollower(req.params.username).then((result) => res.send(result));
}

// Check if users x is following user y
function isFollowing(req, res, next) {
	const reqUsername = req.user.username;
	followModel.isFollowing(reqUsername, req.params.username).then((result) => res.send(result));
}

// Get Edit View
function editUser(req, res, next) {
	userModel
		.getUser(req.params.username)
		.then((user) => res.render('user/editUser', { reqUser: req.user, user: user }))
		.catch((error) => res.status(500).render('error', { reqUser: req.user, error }));
}

// Update the use data
function updateUser(req, res, next) {
	userModel
		.updateUser(req.body)
		.then((user) => res.redirect('/users/' + req.body.username))
		.catch((error) => res.status(500).render('error', { reqUser: req.user, error }));
}

// Create a new user
function addUser(req, res, next) {
	const newUser = req;
	userModel
		.addUser(newUser)
		.then((result) => res.status(200).json({ result: result }))
		.catch((error) => res.status(500).render('error', { reqUser: req.user, error }));
}

// Update user picture
function updateUserPicture(req, res, next) {
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).render('error', { reqUser: req.user, error: 'No files were uploaded', reqUser: req.user });
	}
	userModel
		.updateUserPicture(req.params.username, req.files)
		.then((user) => res.redirect('/users/' + req.params.username + '/edit'))
		.catch((error) => res.status(500).render('error', { reqUser: req.user, error }));
}

// Update user password
function updatePassword(req, res, next) {
	userModel
		.getUser(req.user.username)
		.then(async (user) => {
			const password = req.body.old_pw;
			const hash = user.password;
			if (req.user.privilege === 'admin' || (await bcrypt.compare(password, hash))) {
				userModel
					.updatePassword(req.params.username, req.body.new_pw)
					.then((user) => res.redirect('/users/' + req.params.username + '/edit'))
					.catch((error) => res.status(500).render('error', { reqUser: req.user, error: error }));
			} else {
				res.render('user/editPassword', { reqUser: req.user, error: 'Wrong password' });
			}
		})
		.catch((error) => res.status(500).render('error', { reqUser: req.user, error: error }));
}

// Get User Specific Feed
function getFeed(req, res, next) {
	let username = req.user.username;
	postModel
		.getFeedUser(username)
		.then((feed) => {
			res.render('feed', { reqUser: req.user, feed });
		})
		.catch((error) => res.status(500).render('error', { reqUser: req.user, error }));
}

// Check if Username is available
function validateUsername(req, res, next) {
	userModel
		.validateUsername(req.params.username)
		.then((result) => res.json({ available: result }))
		.catch((error) => res.status(500).render('error', { reqUser: req.user, error: 'Internal Server Error' }));
}

// Render Users view with search results
function searchUsers(req, res, next) {
	userModel
		.searchUsers(req.body.search)
		.then((users) => res.render('user/users', { reqUser: req.user, users: users, search: req.body.search }))
		.catch((error) => res.status(500).render('error', { reqUser: req.user, error }));
}

// Request Admin Privilege for (self) a user (user get's it immediatly)
function requestAdmin(req, res, next) {
	userModel
		.requestAdmin(req.user.username)
		.then(async (result) => {
			const expirationTime = 60 * 60 * 24 * 7;
			const expirationDate = Math.floor(Date.now() / 1000) + expirationTime; // 1 week from now
			const accessToken = await createJWT(req.user.username, 'admin', expirationDate);
			res.cookie('accessToken', accessToken, { maxAge: expirationDate });
			res.redirect('/users/' + req.user.username + '/edit');
		})
		.catch((error) => res.status(500).render('error', { reqUser: req.user, error }));
}

// Request Admin Privilege for (other) a user (user get's it immediatly)
function makeAdmin(req, res, next) {
	userModel
		.requestAdmin(req.params.username)
		.then((result) => res.redirect('/users/' + req.params.username + '/edit'))
		.catch((error) => res.status(500).render('error', { reqUser: req.user, error }));
}

module.exports = {
	getUsers,
	getUser,
	editUser,
	updateUser,
	addUser,
	followUser,
	unfollowUser,
	getFollower,
	isFollowing,
	updateUserPicture,
	updatePassword,
	getFeed,
	deleteUser,
	validateUsername,
	searchUsers,
	requestAdmin,
	makeAdmin,
};
