import express from "express";
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const env = require("./env.js");
const port = process.env.PORT || env.PORT;
const data = process.env.DATA_PERSISTENCE_MODE || env.DATA_PERSISTENCE_MODE;

const FileSystemDAO = require("./dao/FileSystem/FileSystem.js");
const MySQLDAO = require("./dao/MySQL/MySQL.js");
const SQLite3DAO = require("./dao/SQLite/SQLite3.js");
const MongoDBDAO = require("./dao/MongoDB/MongoDB.js");
const FirestoreDAO = require("./dao/Firestore/Firestore.js");

const generateToken = require("./routes/generate-token.js");
const verifyToken = require("./routes/validate-token.js");
const products = require("./routes/products.js");
const orders = require("./routes/orders.js");

const fs = new FileSystemDAO();
const mysql = new MySQLDAO();
const sqlite = new SQLite3DAO();
const mongo = new MongoDBDAO();
const firestore = new FirestoreDAO();

switch (data) {
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
		mongo.buildSchema();
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
app.set("socketio", io);
app.use(generateToken);
app.use(verifyToken, products);
app.use(verifyToken, orders);

app.get("/", (req, res) => {
	res.status(200).sendFile("index.html", { root: __dirname + "/public" });
});
/////////////////////////////////////////////////////////
io.on("connect", (socket) => {
	socket.emit("id", socket.id);
});
/////////////////////////////////////////////////////////
server
	.listen(port, () => {
		console.log(
			`magic is happening in http://localhost:${port} and the data persistance mode is ${data}. to change persistance mode, you can start server with command: DATA_PERSISTANCE_MODE=MyPersistanceMode npm start. MyPersistanceMode can be: 1 [FileSystem], 2 [MySQL], 3 [SQLite3], 4 [MongoDB] or 5 [Firebase]`
		);
	})
	.on("err", (err) =>
		console.log(`something is preventing us grow , more detail in: ${err}`)
	);
