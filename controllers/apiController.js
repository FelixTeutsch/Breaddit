const likeModel = require('../models/likeModel');
// Always Return a JSON object, because these are API Calls and not views.

/**
 * @deprecated handelt in likeController
 */
function likePost(req, res, next) {
	const username = req.body.username;
	username ??= req.user.username;
	const post_id = req.body.post_id;
	post_id ??= req.params.post_id;
	likeModel
		.hasLiked(username, post_id)
		.then((result) => {
			if (result) {
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

/**
 * @deprecated handelt in userConstroller
 */
function validateUsername(req, res, next) {
	userModel
		.validateUsername(req.params.username)
		.then((result) => res.json({ available: result }))
		.catch((error) => res.status(500).render('error', { reqUser: req.user, error: 'Internal Server Error' }));
}

module.exports = {
	likePost,
	validateUsername,
};
