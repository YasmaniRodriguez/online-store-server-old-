const { schema } = require("normalizr");

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

module.exports = message;
