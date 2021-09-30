const env = require("./env.js");

function getDataHandlerFile() {
	switch (process.env.DATA_PERSISTENCE_MODE || env.DATA_PERSISTENCE_MODE) {
		case 1:
			return "./dao/MongoDB/MongoDB.js";
			break;
		case 2:
			return "./dao/MySQL/MySQL.js";
			break;
		case 3:
			return "./dao/SQLite/SQLite3.js";
			break;
		default:
			console.log("persistence mode was not selected");
			break;
	}
}

module.exports = { getDataHandlerFile };
