const env = require("./env.js");
const { schema, normalize, denormalize } = require("normalizr");

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

function normalizeData(input) {
	let author = new schema.Entity("authors", {}, { idAttribute: "email" });
	let message = new schema.Entity(
		"messages",
		{
			author: author,
		},
		{
			idAttribute: "_id",
		}
	);
	let normalized = normalize(input, [message]);
	return normalized;
}

module.exports = { getDataHandlerFile, normalizeData };
