const { sqlite } = require("./odbc");
const db = require("knex")(sqlite);

const dbCreateSchema = () => {
	db.schema.hasTable("messages").then((exists) => {
		if (!exists) {
			return db.schema
				.createTable("messages", (table) => {
					table.increments("id").primary();
					table.string("nickname", 20);
					table.string("spoke", 250);
					table.string("datetime", 50);
				})
				.then(() =>
					console.log("Congrats, Messages DB Schema is created successfully!")
				)
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					db.destroy();
				});
		} else {
			console.log("Fantastic, Messages DB Schema already exists!");
		}
	});
};

const addMessage = (message) => {
	db("messages")
		.insert([
			{ nickname: message.nickname },
			{ spoke: message.spoke },
			{ datetime: message.datetime },
		])
		.then(() => {
			console.log("message delivered");
		})
		.catch((err) => {
			console.log(err);
		});
};

const getMessage = () => {
	let messages = [];
	db.from("messages")
		.select("nickname", "spoke", "datetime")
		.orderBy("id")
		.then((rows) => {
			rows.map((message) => {
				messages.push({ ...message });
			});
		})
		.catch((err) => {
			console.log(err);
		})
		.finally(() => {
			db.destroy();
		});
	return messages;
};

module.exports = { dbCreateSchema, getMessage };
