const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = 8080;
const products = [];

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
	res.status(200).sendFile("index.html", { root: __dirname });
});

io.on("connection", (socket) => {
	console.log(`connection_identifier: ${socket.id}`);
	socket.emit("products", products);
	socket.on("new-product", (data) => {
		products.push(data);
		io.emit("products", products);
	});
});

server.listen(port, () => {
	console.log(`magic is happening in http://localhost:${port}`);
});
