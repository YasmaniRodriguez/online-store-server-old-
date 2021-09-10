//@ts-check
import { Server, Socket } from "socket.io";
import { createServer } from "http";

const express = require("express");
const moment = require("moment");
const fs = require("fs");
const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 8080;

const products: {
	name: string;
	description: string;
	price: number;
	image: string;
}[] = [];
const channel = "./channel.json";
const messages = getMessage();
const now = moment().format("DD/MM/YYYY HH:MM:SS");

const schema = require("./db/queriesStoreDB");

schema.dbCreateSchema();

function addMessage(message: {
	nickname: string;
	datetime: string;
	message: string;
}) {
	try {
		const data = fs.readFileSync(channel);
		const json = JSON.parse(data.toString("utf-8"));
		json.push({ ...message });
		fs.writeFileSync(channel, JSON.stringify(json, null, "\t"));
	} catch {
		try {
			fs.writeFileSync(channel, JSON.stringify([{ ...message }]));
		} catch (e) {
			let err = <Error>e;
			console.log(err.stack);
		}
	}
}

function getMessage() {
	try {
		const data = fs.readFileSync(channel);
		const json = JSON.parse(data.toString("utf-8"));
		return json;
	} catch {
		try {
			fs.writeFileSync(channel, JSON.stringify([]));
		} catch (e) {
			let err = <Error>e;
			console.log(err.stack);
		}
	}
}

/////////////////////////////////////////////////////////////////
app.use(express.static(__dirname + "/public"));

app.get("/", (req: any, res: any) => {
	res.status(200).sendFile("index.html", { root: __dirname });
});

io.on("connection", (socket: Socket) => {
	console.log(`connection_identifier: ${socket.id}`);

	socket.emit("products", products);
	socket.emit("messages", messages);

	socket.on("new-product", (product: any) => {
		products.push(product);
		io.emit("products", products);
	});

	socket.on("new-message", (message: any) => {
		addMessage({ ...message, datetime: now });
		io.emit("messages", messages);
	});
});

server
	.listen(port, () => {
		console.log(`magic is happening in http://localhost:${port}`);
	})
	.on("error", (err) => {
		console.log(`something is preventing us grow , more detail in: ${err}`);
	});
