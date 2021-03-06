import express from "express";
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const env = require("./env.js");
const port = process.env.PORT || env.PORT;
const dataHandlerFile = require("./functions.js").getDataHandlerFile();
const DAO = require(dataHandlerFile);
const classes = require("./classes.js");
const cookieParse = require("cookie-parser");
const session = require("express-session");
const path = require("path");

const login = require("./routes/login.js");
const verifyToken = require("./routes/validate-token.js");
const products = require("./routes/products.js");
const carts = require("./routes/carts.js");
const orders = require("./routes/orders.js");
const messages = require("./routes/messages.js");

const dataHandler = new DAO();
dataHandler.buildSchema();

app.use(
	session({
		secret: "keyboard",
		resave: false,
		saveUninitialized: false,
		cookie: {},
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("socketio", io);
app.set("dataHandler", dataHandler);
app.use(login);
app.use(verifyToken, products);
app.use(verifyToken, carts);
app.use(verifyToken, orders);
app.use(verifyToken, messages);
app.use(cookieParse());

// app.get("/", (req, res) => {
// 	//res.status(200).sendFile("index.html", { root: __dirname + "/public" });
// });

/////////////////////////////////////////////////////////
io.on("connect", (socket) => {
	const undefinedUser = new classes.Profile(
		"Albert",
		"Einstein",
		"1879-03-14",
		null,
		"usuario_1@gmail.com",
		"https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/scientist_einstein_avatar_professor-256.png"
	);

	console.log(`connection_identifier: ${socket.id}`);
	socket.emit("profile", undefinedUser);
	dataHandler
		.getMessages()
		.then((rows) => {
			io.emit("messages", rows);
		})
		.catch((err) => {
			console.log(err);
		});
	socket.on("new-message", (message) => {
		dataHandler.addMessages({ ...message });
		dataHandler
			.getMessages()
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
	.listen(port, () => {
		console.log(
			`magic is happening in http://localhost:${port} and the data persistance mode is ${
				process.env.DATA_PERSISTENCE_MODE || env.DATA_PERSISTENCE_MODE
			}. to change persistance mode, you can start server with command: DATA_PERSISTANCE_MODE=MyPersistanceMode npm start. MyPersistanceMode can be: 1 [MongoDB], 2 [MySQL], 3 [SQLite3] or 4 [FileSystem]`
		);
	})
	.on("err", (err) =>
		console.log(`something is preventing us grow , more detail in: ${err}`)
	);
