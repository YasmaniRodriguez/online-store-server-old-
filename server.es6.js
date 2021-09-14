import express from "express";

const SERVER = express();
const HTTP = require("http").Server(SERVER);
const io = require("socket.io")(HTTP);
const PORT = process.env.PORT || 8080;
const products = require("./routes/products");
const cart = require("./routes/cart");

const functions = require("./functions.js");
functions.create_table_products();
functions.create_table_messages();

SERVER.use(express.json());
SERVER.use(express.urlencoded({ extended: true }));
SERVER.use(express.static(__dirname + "/public"));
SERVER.use("/endpoint", products);
SERVER.use("/endpoint", cart);

SERVER.get("/", (req, res) => {
	res.status(200).sendFile("index.html", { root: __dirname + "/public" });
});

io.on("connection", (socket) => {
	console.log(`connection_identifier: ${socket.id}`);
	functions.getMessages
		.then((rows) => {
			io.emit("messages", rows);
		})
		.catch((err) => {
			console.log(err);
		});
	socket.on("new-message", (message) => {
		functions.addMessage({ ...message, datetime: functions.timestamp });
		functions.getMessages
			.then((rows) => {
				io.emit("messages", rows);
			})
			.catch((err) => {
				console.log(err);
			});
	});
});

HTTP.listen(PORT, () => {
	console.log(`magic is happening in http://localhost:${PORT}`);
}).on("err", (err) =>
	console.log(`something is preventing us grow , more detail in: ${err}`)
);
