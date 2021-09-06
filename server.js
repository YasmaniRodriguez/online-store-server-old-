import express from "express";

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = 8080;
const products = [];

const Channel = require("./channel");

const messages = new Channel("messages.json");

// messages.viewMessage().then((data) => {
// 	const conversation = data;
// });

// console.log(messages.viewMessage());

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
	res.status(200).sendFile("index.html", { root: __dirname });
});

io.on("connection", (socket) => {
	console.log(`connection_identifier: ${socket.id}`);
	socket.emit("products", products);
	socket.on("newProduct", (data) => {
		products.push(data);
		io.emit("products", products);
	});
});

server
	.listen(port, () => {
		console.log(`magic is happening in http://localhost:${port}`);
	})
	.on("error", (error) =>
		console.log(`something is preventing us grow , more detail in: ${error}`)
	);
