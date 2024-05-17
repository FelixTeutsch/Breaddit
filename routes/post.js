const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { checkUser } = require('../services/authentication');

// Make Sure user is Logged in to access these routes
// Get post page, create post
router.route('/').get(checkUser, postController.getPostPage).post(checkUser, postController.createPost);

// Get Post image (only if user has access & Post Exists -> Otherwise error images are sent)
router.get('/:filename', postController.getPostFile);

module.exports = router;
