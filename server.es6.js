import express from "express";
import moment from "moment";
import fs from "fs";

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = 8080;

const products = [];
const channel = "./channel.json";
const messages = getMessage();
const now = moment().format("DD/MM/YYYY HH:MM:SS");

const storeDB = require("./db/queriesStoreDB");
const messagesDB = require("./db/queriesMessagesDB");

storeDB.dbCreateSchema();
messagesDB.dbCreateSchema();

function addMessage(message) {
	try {
		const data = fs.readFileSync(channel);
		const json = JSON.parse(data.toString("utf-8"));
		json.push({ ...message });
		fs.writeFileSync(channel, JSON.stringify(json, null, "\t"));
	} catch {
		try {
			fs.writeFileSync(channel, JSON.stringify([{ ...message }]));
		} catch (err) {
			throw new Error(err);
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
		} catch (err) {
			throw new Error(err);
		}
	}
}

///////////////////////////////////////////////////////////////
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
	res.status(200).sendFile("index.html", { root: __dirname });
});

io.on("connection", (socket) => {
	console.log(`connection_identifier: ${socket.id}`);

	socket.emit("products", products);
	socket.emit("messages", messages);

	socket.on("new-product", (product) => {
		products.push(product);
		io.emit("products", products);
	});

	socket.on("new-message", (message) => {
		addMessage({ ...message, datetime: now });
		io.emit("messages", messages);
	});
});

server
	.listen(port, () => {
		console.log(`magic is happening in http://localhost:${port}`);
	})
	.on("error", (error) =>
		console.log(`something is preventing us grow , more detail in: ${error}`)
	);
