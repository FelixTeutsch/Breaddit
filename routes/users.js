const express = require('express');
const path = require('path');
const router = express.Router();
const userController = require('../controllers/userController');
const userModel = require('../models/userModel');
const postModel = require('../models/postModel');
const { checkUser } = require('../services/authentication');

// Get all users (post for search)
router.route('/').get(userController.getUsers).post(userController.searchUsers);

// Make Sure user is Logged in to access these routes
router.use(checkUser);

// Get user feed
router.route('/feed').get(userController.getFeed);

// Get user page
router.get('/:username', userController.getUser);

// Follow
router.route('/:username/follow').get(userController.followUser);

// Unfollow
router.route('/:username/unfollow').get(userController.unfollowUser);

// Get Followers
router.route('/:username/follower').get(userController.getFollower);

// Check if Following
router.route('/:username/isFollowing').get(userController.isFollowing);

// Get user edit page, update user
router.route('/:username/edit').get(userController.editUser).post(userController.updateUser);

// Get image edit page, upate picture(s)
router.route('/:username/edit/picture')
	.get((req, res, next) => res.render('user/editPicture', { reqUser: req.user, user: { username: req.params.username } }))
	.post(userController.updateUserPicture);

// Get password edit page, update password
router.route('/:username/edit/password')
	.get((req, res, next) => res.render('user/editPassword', { reqUser: req.user, user: { username: req.params.username } }))
	.post(userController.updatePassword);

// Delete user
router.route('/:username/delete').post(userController.deleteUser);

module.exports = router;
