require('dotenv').config();
const mySQL = require('mysql');

/**
 * Database service to establish connection to MySQL database.
 *
 * @type {Connection} config - The MySQL connection object.
 */
const config = mySQL.createConnection({
	host: 'atp.fhstp.ac.at',
	port: '8007',
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

// Connect to the MySQL database
config.connect(function (error) {
	if (error) throw error;
	console.log('Connected');
});

module.exports = { config };
