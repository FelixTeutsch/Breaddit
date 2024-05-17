const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

async function authenticateUser({ username, password }, user, res) {
	console.log('Authentificating User:', username, password);
	if (user.username === username && (await checkPassword(password, user.password))) {
		const expirationTime = 60 * 60 * 24 * 7;
		const expirationDate = Math.floor(Date.now() / 1000) + expirationTime; // 1 week from now
		const accessToken = await createJWT(user.username, user.privilege, expirationDate);

		res.cookie('accessToken', accessToken, { maxAge: expirationDate });
		res.redirect('/users/' + user.username);
	} else {
		console.log('Wrong password!');
		const reqUser = {
			username: 'guest',
			privilege: 'guest',
		};
		res.status(403).render('error', { error: 'Username or password incorrect', reqUser });
	}
}

function authenticateJWT(req, res, next) {
	const token = req.cookies['accessToken'];
	// The variable ACCESS_TOKEN_SECRET is for whatever reason not working here...
	const secret = process.env.ACCESS_TOKEN_SECRET;
	req.user = {
		username: 'guest',
		privilege: 'guest',
	};

	if (token) {
		jwt.verify(token, secret, (error, decodedToken) => {
			if (error) {
				console.log('Error decoding token:', error.message);
			} else if (decodedToken.exp <= Math.floor(Date.now() / 1000)) {
				// Token has expired
				res.cookie('accessToken', '', { maxAge: 0 });
			} else {
				req.user = decodedToken;
			}
		});
	} else {
		console.log('No token provided!');
	}

	next();
}

async function createJWT(username, privilege, expirationTime) {
	// The variable ACCESS_TOKEN_SECRET is for whatever reason not working here...
	const secret = process.env.ACCESS_TOKEN_SECRET;
	return (accessToken = await jwt.sign({ username, privilege, exp: expirationTime }, secret));
}

function getJwtPayload(req, res, next) {
	const token = req.cookies['accessToken'];
	if (token) {
		const payload = jwt.decode(token);
		return payload;
	}
	return token;
}

async function checkPassword(password, hash) {
	let pw = await bcrypt.compare(password, hash);
	return pw;
}

function checkUser(req, res, next) {
	console.log(req.url);
	if (req.user && req.user.username !== 'guest') next();
	else res.redirect('/');
}

module.exports = {
	authenticateUser,
	authenticateJWT,
	createJWT,
	getJwtPayload,
	checkUser,
};
