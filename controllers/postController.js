const postModel = require('../models/postModel');
const path = require('path');
const fs = require('fs');
const { error } = require('console');

// Render Post View
function getPostPage(req, res, next) {
	res.render('createPost', { reqUser: req.user });
}

// Create new Post
function createPost(req, res, next) {
	const username = req.user.username;

	const postFile = req.files.image;
	const caption = req.body.caption;

	if (!postFile || !caption) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	// postFile.name is the name (xxx.jpg) of the file
	// postFile.name.split('.').pop() is the file extension (jpg)
	postModel
		.savePostLocally(username, postFile, postFile.name.split('.').pop())
		.then((filename) => {
			return postModel.savePostToDatabase(username, filename, caption);
		})
		.then((result) => {
			// Redirect the user to the /users/:username route
			res.redirect(`/users/${username}`);
		})
		.catch((error) => {
			console.error('Error saving post:', error);
			return res.status(500).render('error', { reqUser: req.user, error: error });
		});
}

// Send Post File if user has access & file exists
async function getPostFile(req, res, next) {
	const filename = req.params.filename;
	const options = {
		root: path.join(__dirname, '../post/'),
	};
	const filePath = path.join(__dirname, '../post/', filename);

	postModel
		.canViewPost(req.user.username, filename)
		.then((canView) => {
			// Check if the file exists
			fs.access(filePath, fs.constants.F_OK, (error) => {
				if (canView || req.user.privilege === 'admin')
					if (error)
						// File does not exist
						res.status(404).sendFile('unavailable.svg', options);
					// File exists, send it
					else res.sendFile(filename, options);
				//User has no access
				else res.sendFile('no_access.svg', options);
			});
		})
		.catch((error) => res.status(404).sendFile('unavailable.svg', options));
}

module.exports = {
	getPostPage,
	getPostFile,
	createPost,
};
