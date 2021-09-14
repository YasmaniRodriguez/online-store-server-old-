import moment from "moment";

const { mysql, sqlite } = require("./odbc");
const store = require("knex")(mysql);
const chat = require("knex")(sqlite);

const timestamp = moment().format();

const create_table_products = () => {
	store.schema.hasTable("products").then((exists) => {
		if (!exists) {
			return store.schema
				.createTable("products", (table) => {
					table.increments("id").primary();
					table.string("code", 10);
					table.string("name", 20);
					table.string("description", 50);
					table.string("image");
					table.decimal("price");
					table.integer("stock");
					table.string("timestamp");
				})
				.then(() =>
					console.log("congrats, store db schema is created successfully!")
				)
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					store.destroy();
				});
		} else {
			console.log("fantastic, store db schema already exists!");
		}
	});
};

const create_table_messages = () => {
	chat.schema.hasTable("messages").then((exists) => {
		if (!exists) {
			return chat.schema
				.createTable("messages", (table) => {
					table.increments("id").primary();
					table.string("alias", 20);
					table.string("datetime", 50);
					table.string("message", 250);
				})
				.then(() =>
					console.log("congrats, chat db schema is created successfully!")
				)
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					chat.destroy();
				});
		} else {
			console.log("fantastic, chat db schema already exists!");
		}
	});
};

const addMessage = (message) => {
	chat
		.insert([
			{
				alias: message.alias,
				datetime: message.datetime,
				message: message.message,
			},
		])
		.into("messages")
		.then(() => {
			console.log("message delivered");
		})
		.catch((err) => {
			console.log(err);
		});
};

const getMessages = chat
	.select("alias", "datetime", "message")
	.from("messages");

module.exports = {
	timestamp,
	create_table_products,
	create_table_messages,
	addMessage,
	getMessages,
};
