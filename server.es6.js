import express from "express";
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 8080;
const persistance_mode = process.env.DATA_PERSISTANCE_MODE || "FileSystem";
const functions = require("./functions.js");
const generateToken = require("./routes/generate-token.js");
const verifyToken = require("./routes/validate-token.js");
const products = require("./routes/products.js");
const cart = require("./routes/cart.js");

functions.create_table_products();
functions.create_table_messages();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(generateToken);
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
		console.log(
			`Magic is happening in http://localhost:${PORT} and the data persistance mode is ${persistance_mode}. To change persistance mode, you can start server with command: DATA_PERSISTANCE_MODE=MyPersistanceMode npm start. MyPersistanceMode can be: FileSystem, MySQL, SQLite3, MongoDB or Firebase`
		);
	})
	.on("err", (err) =>
		console.log(`Something is preventing us grow , more detail in: ${err}`)
	);
