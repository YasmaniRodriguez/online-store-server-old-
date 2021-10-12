"use strict";

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var app = (0, _express["default"])();

var server = require("http").Server(app);

var io = require("socket.io")(server);

var env = require("./env.js");

var port = process.env.PORT || env.PORT;

var dataHandlerFile = require("./functions.js").getDataHandlerFile();

var DAO = require(dataHandlerFile);

var classes = require("./classes.js");

var generateToken = require("./routes/generate-token.js");

var verifyToken = require("./routes/validate-token.js");

var products = require("./routes/products.js");

var carts = require("./routes/carts.js");

var orders = require("./routes/orders.js");

var messages = require("./routes/messages.js");

var dataHandler = new DAO();
dataHandler.buildSchema();
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use(_express["default"]["static"](__dirname + "/public"));
app.set("socketio", io);
app.set("dataHandler", dataHandler);
app.use(generateToken);
app.use(verifyToken, products);
app.use(verifyToken, carts);
app.use(verifyToken, orders);
app.use(verifyToken, messages);
app.get("/", function (req, res) {
  res.status(200).sendFile("index.html", {
    root: __dirname + "/public"
  });
}); /////////////////////////////////////////////////////////

io.on("connect", function (socket) {
  var undefinedUser = new classes.Profile("Albert", "Einstein", "1879-03-14", null, "usuario_1@gmail.com", "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/scientist_einstein_avatar_professor-256.png");
  console.log("connection_identifier: ".concat(socket.id));
  socket.emit("profile", undefinedUser);
  dataHandler.getMessages().then(function (rows) {
    io.emit("messages", rows);
  })["catch"](function (err) {
    console.log(err);
  });
  socket.on("new-message", function (message) {
    dataHandler.addMessages(_objectSpread({}, message));
    dataHandler.getMessages().then(function (rows) {
      io.emit("messages", rows);
    })["catch"](function (err) {
      console.log(err);
    });
  });
}); /////////////////////////////////////////////////////////

server.listen(port, function () {
  console.log("magic is happening in http://localhost:".concat(port, " and the data persistance mode is ").concat(process.env.DATA_PERSISTENCE_MODE || env.DATA_PERSISTENCE_MODE, ". to change persistance mode, you can start server with command: DATA_PERSISTANCE_MODE=MyPersistanceMode npm start. MyPersistanceMode can be: 1 [MongoDB], 2 [MySQL], 3 [SQLite3] or 4 [FileSystem]"));
}).on("err", function (err) {
  return console.log("something is preventing us grow , more detail in: ".concat(err));
});
