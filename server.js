const express = require("express");
const server = express();
const http = require("http").Server(server);
const io = require("socket.io")(http);

server.use(express.static(__dirname + "/public"));

server.get("/", (req, res) => {
	res.sendFile("index.html", { root: __dirname });
});

http.listen(3000, () => console.log("SERVER ON"));

io.on("connection", (socket) => {
	console.log("cliente conectado: " + socket.id);
	socket.emit("saludo", "hola usuario");
	socket.on("saludo", (data) => {
		console.log(data);
	});
});
