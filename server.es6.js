import express from "express";
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const env = require("./settings/env.js");
const PORT = process.env.PORT || env.PORT;
const persistance =
	process.env.DATA_PERSISTANCE_MODE || env.DATA_PERSISTANCE_MODE;
const functions = require("./functions.js");

const FileSystemDAO = require("./dao/FileSystem.js");
const MySQLDAO = require("./dao/MySQL.js");
const SQLite3DAO = require("./dao/SQLite3.js");
const MongoDBDAO = require("./dao/MongoDB.js");
const FirestoreDAO = require("./dao/Firestore.js");

const generateToken = require("./routes/generate-token.js");
const verifyToken = require("./routes/validate-token.js");
const products = require("./routes/products.js");
const cart = require("./routes/cart.js");

const fs = new FileSystemDAO();
const mysql = new MySQLDAO();
const sqlite = new SQLite3DAO();
const mongo = new MongoDBDAO();
const firestore = new FirestoreDAO();

switch (persistance) {
	case 1:
		fs.buildSchema();
		break;
	case 2:
		mysql.buildSchema();
		break;
	case 3:
		sqlite.buildSchema();
		break;
	case 4:
		mongo.createProducts();
		break;
	case 5:
		firestore.buildSchema();
		break;
	default:
		break;
}

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
// io.on("connection", (socket) => {
// 	console.log(`connection_identifier: ${socket.id}`);
// 	functions.getMessages
// 		.then((rows) => {
// 			io.emit("messages", rows);
// 		})
// 		.catch((err) => {
// 			console.log(err);
// 		});
// 	socket.on("new-message", (message) => {
// 		functions.addMessage({ ...message, datetime: functions.timestamp });
// 		functions.getMessages
// 			.then((rows) => {
// 				io.emit("messages", rows);
// 			})
// 			.catch((err) => {
// 				console.log(err);
// 			});
// 	});
// });
/////////////////////////////////////////////////////////
server
	.listen(PORT, () => {
		console.log(
			`Magic is happening in http://localhost:${PORT} and the data persistance mode is ${persistance}. To change persistance mode, you can start server with command: DATA_PERSISTANCE_MODE=MyPersistanceMode npm start. MyPersistanceMode can be: 1 [FileSystem], 2 [MySQL], 3 [SQLite3], 4 [MongoDB] or 5 [Firebase]`
		);
	})
	.on("err", (err) =>
		console.log(`Something is preventing us grow , more detail in: ${err}`)
	);
