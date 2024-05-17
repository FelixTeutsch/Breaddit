const likeModel = require('../models/likeModel');

// Like a post, unlike a post
function likePost(req, res, next) {
	const username = req.body.username;
	username ??= req.user.username;
	const post_id = req.body.post_id;
	post_id ??= req.params.post_id;

	// Check if user has liked post
	likeModel
		.hasLiked(username, post_id)
		.then((result) => {
			if (result) {
				// Remove Like
				likeModel
					.likeRemove(username, post_id)
					.then((result) => {
						res.status(200).json({ message: 'Like removed successfully', action: 'remove' });
					})
					.catch((error) => {
						console.error('Error liking post:', error);
						return res.status(500).render('error', { reqUser: req.user, error: 'Error liking post' });
					});
			} else {
				// Like Post
				likeModel
					.likePost(username, post_id)
					.then((result) => {
						res.status(200).json({ message: 'Post liked successfully', action: 'like' });
					})
					.catch((error) => {
						console.error('Error liking post:', error);
						return res.status(500).render('error', { reqUser: req.user, error: 'Error liking post' });
					});
			}
		})
		.catch((error) => {
			return res.status(500).render('error', { reqUser: req.user, error: 'Error liking post', message: error });
		});
}

module.exports = {
	likePost,
};
