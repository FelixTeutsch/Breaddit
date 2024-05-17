const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const ejs = require('ejs');
const ws = require('./services/websockets');
const morgan = require('morgan');
const fs = require('fs');
const { authenticateJWT } = require('./services/authentication');
// Port
const port = 3000;

// Create an Express app
const app = express();
app.use(cors());

// Set views directory and view engine to EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Parse request bodies as JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable file uploads with express-fileupload
app.use(fileUpload({ createParentPath: true }));

// Parse cookies with cookie-parser
app.use(cookieParser());

const date = new Date();

// This arrangement can be altered based on how we want the date's format to appear.
let currentDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

let logDirectory = path.join(__dirname, 'logs');
let logPath = path.join(logDirectory, `requests_${currentDate}.log`);

// Create the logs directory if it doesn't exist
if (!fs.existsSync(logDirectory)) {
	fs.mkdirSync(logDirectory);
}

// Create the log file if it doesn't exist
if (!fs.existsSync(logPath)) {
	fs.writeFileSync(logPath, '');
}

const accessLogStream = fs.createWriteStream(logPath, { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('short'));

// Serve static files from the "public" directory

// Import routers for different routes
const indexRouter = require('./routes/index');
const postRouter = require('./routes/post');
const chatRouter = require('./routes/chat');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');

// Use routers for corresponding routes
app.use(authenticateJWT);
app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/chat', chatRouter);
app.use('/users', usersRouter);
app.use('/post', postRouter);
app.use('/public', express.static('public', { fallthrough: true }));

app.use(unknownHanndler);
app.use(errorHandler);

// Handle 404 (Unknown Stuff)
function unknownHanndler(req, res, next) {
	// Your existing error-handling logic
	const resourcePath = req.url;
	console.log('Unknown file Requested:', resourcePath);
	const publicPath = path.join(__dirname, 'public', resourcePath);

	// Serve default Image
	if (resourcePath.startsWith('/public') && !fs.existsSync(publicPath)) {
		if (resourcePath.startsWith('/public/user/') && !fs.existsSync(publicPath)) {
			const options = {
				root: path.join(__dirname, '/public/user/'),
			};
			if (resourcePath.endsWith('profile.jpg')) res.sendFile('guest_profile.svg', options);
			else res.sendFile('guest_banner.svg', options);
			return;
		}
		const error = 'file not found';
		const message = 'Please use one of the following resources';
		const routes = ['/public/images', '/public/javascripts', '/public/stylesheets'];
		res.status(404).render('error', { reqUser: req.user, status: 404, error, message, routes });
	} else if (resourcePath.startsWith('/api')) res.status(500).json({ error: 'Error with the resource you requested' });
	else res.status(404).render('error', { reqUser: req.user, status: 404, error: 'Page not found' });

	if (req.isAuthenticated) {
		console.log('User is authenticated');
		console.log('User data:', req.user);
	} else {
		console.log('User is not authenticated');
	}
	next();
}

// Handle errors
function errorHandler(error, req, res, next) {
	console.log(error);
	res.render('error', { error, reqUser: req.user });
}

// Start the app and listen for requests on specified port
app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`);
});
