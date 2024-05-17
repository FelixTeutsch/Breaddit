const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

// Get home page, login page, register page
router.route('/').all(indexController.getHomePage);
router.route('/login').get(indexController.getLoginPage).post(indexController.loginUser);
router.route('/register').get(indexController.getRegisterPage).post(indexController.registerUser);

// Log use out (by deleting jwt cookie)
router.get('/logout', indexController.logoutUser);

/**
 * @deprecated
 */
// router.get('/cookies', (req, res, next) => {
// 	let counter = req.cookies['visitCounter'];
// 	console.log('Current counter value: ' + counter);
// 	if (isNaN(counter)) counter = 0;
// 	counter++;
// 	console.log('New Counter value: ' + counter);
// 	res.cookie('visitCounter', counter, { maxAge: 2 * 60 * 60 * 1000 });
// 	res.send('You have visited this page ' + counter + ' times!');
// });

module.exports = router;
