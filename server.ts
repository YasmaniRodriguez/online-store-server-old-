//@ts-check
import { Server, Socket } from "socket.io";
import { createServer } from "http";

const express = require("express");
const moment = require("moment");
const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 8080;

const server_time = moment().format("DD/MM/YYYY HH:MM:SS");
const products: {
	name: string;
	description: string;
	price: number;
	image: string;
}[] = [];
/////////////////////////////////////////////////////////////////
app.use(express.static(__dirname + "/public"));

app.get("/", (req: any, res: any) => {
	res.status(200).sendFile("index.html", { root: __dirname });
});

io.on("connection", (socket: Socket) => {
	console.log(`connection_identifier: ${socket.id}`);

	socket.emit("products", products);
	getMessages();

	socket.on("new-product", (product: any) => {
		products.push(product);
		io.emit("products", products);
	});

	socket.on("new-message", (message: any) => {
		addMessage({ ...message, datetime: server_time });
		getMessages();
	});
});

server
	.listen(port, () => {
		console.log(`magic is happening in http://localhost:${port}`);
	})
	.on("error", (err) => {
		console.log(`something is preventing us grow , more detail in: ${err}`);
	});
/////////////////////////////////////////////////////////////////
const { mysql, sqlite } = require("./odbc");
const store = require("knex")(mysql);
const chat = require("knex")(sqlite);

(function () {
	store.schema.hasTable("products").then((exists: any) => {
		if (!exists) {
			return store.schema
				.createTable("products", (table: any) => {
					table.increments("id").primary();
					table.string("name", 20);
					table.string("description", 50);
					table.decimal("price");
					table.string("image");
				})
				.then(() =>
					console.log("congrats, store db schema is created successfully!")
				)
				.catch((err: any) => {
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
	chat.schema.hasTable("messages").then((exists: any) => {
		if (!exists) {
			return chat.schema
				.createTable("messages", (table: any) => {
					table.increments("id").primary();
					table.string("alias", 20);
					table.string("datetime", 50);
					table.string("message", 250);
				})
				.then(() =>
					console.log("congrats, chat db schema is created successfully!")
				)
				.catch((err: any) => {
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

const addMessage = (message: {
	alias: string;
	datetime: string;
	message: string;
}) => {
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
		.catch((err: any) => {
			console.log(err);
		});
};

const getMessages = () => {
	chat
		.from("messages")
		.select("alias", "datetime", "message")
		.orderBy("id")
		.then((rows: { alias: string; datetime: string; message: string }) => {
			io.emit("messages", rows);
		})
		.catch((err: any) => {
			console.log(err);
		});
};
