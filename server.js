"use strict";

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();

var server = require("http").Server(app);

var io = require("socket.io")(server);

var env = require("./env.js");

var port = process.env.PORT || env.PORT;
var data = process.env.DATA_PERSISTENCE_MODE || env.DATA_PERSISTENCE_MODE;

var FileSystemDAO = require("./dao/FileSystem/FileSystem.js");

var MySQLDAO = require("./dao/MySQL/MySQL.js");

var SQLite3DAO = require("./dao/SQLite/SQLite3.js");

var MongoDBDAO = require("./dao/MongoDB/MongoDB.js");

var FirestoreDAO = require("./dao/Firestore/Firestore.js");

var generateToken = require("./routes/generate-token.js");

var verifyToken = require("./routes/validate-token.js");

var products = require("./routes/products.js");

var orders = require("./routes/orders.js");

var fs = new FileSystemDAO();
var mysql = new MySQLDAO();
var sqlite = new SQLite3DAO();
var mongo = new MongoDBDAO();
var firestore = new FirestoreDAO();

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

app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use(_express["default"]["static"](__dirname + "/public"));
app.use(generateToken);
app.use(verifyToken, products);
app.use(verifyToken, orders);
app.get("/", function (req, res) {
  res.status(200).sendFile("index.html", {
    root: __dirname + "/public"
  });
}); /////////////////////////////////////////////////////////
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

server.listen(port, function () {
  console.log("magic is happening in http://localhost:".concat(port, " and the data persistance mode is ").concat(data, ". to change persistance mode, you can start server with command: DATA_PERSISTANCE_MODE=MyPersistanceMode npm start. MyPersistanceMode can be: 1 [FileSystem], 2 [MySQL], 3 [SQLite3], 4 [MongoDB] or 5 [Firebase]"));
}).on("err", function (err) {
  return console.log("something is preventing us grow , more detail in: ".concat(err));
});
