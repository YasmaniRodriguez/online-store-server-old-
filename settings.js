const mysql = {
	client: "mysql",
	connection: {
		host: "localhost",
		port: 3306,
		user: "root",
		password: "12345678",
		database: "store",
	},
};

const sqlite = {
	client: "sqlite3",
	connection: {
		filename: "./db/messages.sqlite",
	},
	useNullAsDefault: true,
};

module.exports = { mysql, sqlite };
