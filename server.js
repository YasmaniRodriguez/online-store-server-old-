const express = require("express");
const server = express();
const http = require("http").Server(server);
const io = require("socket.io")(http);
const messages = [];

server.use(express.static(__dirname + "/public"));

server.get("/", (req, res) => {
	res.sendFile("index.html", { root: __dirname });
});

server.get("/messages", (req, res) => {
	res.json(messages);
});

http.listen(3000, () => console.log("SERVER ON"));

io.on("connection", (socket) => {
	console.log("cliente conectado: " + socket.id);
	socket.emit("message", "hola usuario");
	socket.on("saludo", (data) => {
		console.log(data);
	});
	socket.on("keyup", (data) => {
		console.log(data);
		io.emit("user_keyup", data);
		messages.push({ id: socket.id, message: data.value });
	});
});
