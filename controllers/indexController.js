const userModel = require('../models/userModel');
const { authenticateUser, createJWT } = require('../services/authentication');

// Get Home Page
function getHomePage(req, res, next) {
	if (req.user.username !== 'guest') res.redirect('/users/feed');
	else res.render('index');
}

// Get Login Page
function getLoginPage(req, res, next) {
	if (req.user.username !== 'guest') res.redirect('/users/feed');
	else res.render('login', { reqUser: req.user });
}

// Log User in
function loginUser(req, res, next) {
	const { username, password } = req.body;
	userModel
		.getUser(username)
		.then((user) => {
			authenticateUser(req.body, user, res);
		})
		.catch((error) => {
			console.error('Error logging in user:', error);
			res.status(500).render('error', { reqUser: req.user, error: 'Login Failed...', message: error });
		});
}

// Get Register Page
function getRegisterPage(req, res, next) {
	if (req.user.username !== 'guest') res.redirect('/users/feed');
	else res.render('register', { reqUser: req.user });
}

// Register User
function registerUser(req, res, next) {
	userModel
		.addUser(req.body)
		.then((result) => {
			userModel.getUser(req.body.username).then(async (user) => {
				const expirationTime = 60 * 60 * 24 * 7;
				const expirationDate = Math.floor(Date.now() / 1000) + expirationTime; // 1 week from now
				const accessToken = await createJWT(user.username, user.privilege, expirationDate);

				await res.cookie('accessToken', accessToken, { maxAge: expirationDate });
				res.redirect('/users/' + user.username);
			});
		})
		.catch((error) => res.status(500).render('error', { reqUser: req.user, error: error }));
}

// Log User out
function logoutUser(req, res, next) {
	res.clearCookie('accessToken');
	res.redirect('/');
}

module.exports = {
	getHomePage,
	getLoginPage,
	loginUser,
	getRegisterPage,
	registerUser,
	logoutUser,
};
