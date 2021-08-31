const express = require("express"),
	server = express(),
	http = require("http").Server(server),
	io = require("socket.io")(http);

server.use(express.static("./public"));

server.get("/", (req, res) => {
	res.sendFile("index.html", { root: __dirname });
});

http.listen(3000, () => console.log("SERVER ON"));

io.on("connection", (socket) => {
	console.log("Usuario conectado");
	socket.emit("mi mensaje", "este es mi mensaje desde el servidor");
});
