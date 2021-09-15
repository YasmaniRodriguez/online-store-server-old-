import express from "express";
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 8080;
const functions = require("./functions.js");
const login = require("./routes/login.js");
const verifyToken = require("./routes/validate-token.js");
const products = require("./routes/products.js");
const cart = require("./routes/cart.js");

functions.create_table_products();
functions.create_table_messages();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(login);
app.use(verifyToken, products);
app.use(verifyToken, cart);

app.get("/", (req, res) => {
	res.status(200).sendFile("index.html", { root: __dirname + "/public" });
});
/////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////
server
	.listen(PORT, () => {
		console.log(`magic is happening in http://localhost:${PORT}`);
	})
	.on("err", (err) =>
		console.log(`something is preventing us grow , more detail in: ${err}`)
	);
