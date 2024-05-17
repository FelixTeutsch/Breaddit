const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const userController = require('../controllers/userController');

// Like a post, unlike a post
router.post('/post/like', likeController.likePost);

// Check if username exists
router.get('/user/exists/:username', userController.validateUsername);

// Request Admin Rights for User (self)
router.post('/user/admin', userController.requestAdmin);

// Make User (other) Admin
router.post('/user/admin/:username', userController.makeAdmin);

module.exports = router;
