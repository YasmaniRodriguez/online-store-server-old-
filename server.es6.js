import express from "express";
import moment from "moment";

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = 8080;

const server_time = moment().format("DD/MM/YYYY HH:MM:SS");
const products = [];
///////////////////////////////////////////////////////////////
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
	res.status(200).sendFile("index.html", { root: __dirname });
});

io.on("connection", (socket) => {
	console.log(`connection_identifier: ${socket.id}`);

	socket.emit("products", products);
	getMessages();

	socket.on("new-product", (product) => {
		products.push(product);
		io.emit("products", products);
	});

	socket.on("new-message", (message) => {
		addMessage({ ...message, datetime: server_time });
		getMessages();
	});
});

server
	.listen(port, () => {
		console.log(`magic is happening in http://localhost:${port}`);
	})
	.on("error", (error) =>
		console.log(`something is preventing us grow , more detail in: ${error}`)
	);
///////////////////////////////////////////////////////////////
const { mysql, sqlite } = require("./odbc");
const store = require("knex")(mysql);
const chat = require("knex")(sqlite);

(function () {
	store.schema.hasTable("products").then((exists) => {
		if (!exists) {
			return store.schema
				.createTable("products", (table) => {
					table.increments("id").primary();
					table.string("name", 20);
					table.string("description", 50);
					table.decimal("price");
					table.string("image");
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
})();

(function () {
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
})();

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

const getMessages = () => {
	chat
		.from("messages")
		.select("alias", "datetime", "message")
		.orderBy("id")
		.then((rows) => {
			io.emit("messages", rows);
		})
		.catch((err) => {
			console.log(err);
		});
};
///////////////////////////////////////////////////////////////
