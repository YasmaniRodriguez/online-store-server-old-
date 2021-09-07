import express from "express";
import moment from "moment";

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = 8080;
const products = [];
const messages = [];

const now = moment().format("DD/MM/YYYY HH:MM:SS");

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
	res.status(200).sendFile("index.html", { root: __dirname });
});

io.on("connection", (socket) => {
	console.log(`connection_identifier: ${socket.id}`);

	socket.emit("products", products);
	socket.emit("messages", messages);

	socket.on("new-product", (data) => {
		products.push(data);
		io.emit("products", products);
	});

	socket.on("new-message", (data) => {
		console.log(data);
		messages.push({
			nickname: data.nickname,
			datetime: now,
			message: data.text,
		});
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
