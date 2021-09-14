"use strict";

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SERVER = (0, _express["default"])();

var HTTP = require("http").Server(SERVER);

var io = require("socket.io")(HTTP);

var PORT = process.env.PORT || 8080;

var products = require("./routes/products");

var cart = require("./routes/cart");

var functions = require("./functions.js");

functions.create_table_products();
functions.create_table_messages();
SERVER.use(_express["default"].json());
SERVER.use(_express["default"].urlencoded({
  extended: true
}));
SERVER.use(_express["default"]["static"](__dirname + "/public"));
SERVER.use("/endpoint", products);
SERVER.use("/endpoint", cart);
SERVER.get("/", function (req, res) {
  res.status(200).sendFile("index.html", {
    root: __dirname + "/public"
  });
});
io.on("connection", function (socket) {
  console.log("connection_identifier: ".concat(socket.id));
  functions.getMessages.then(function (rows) {
    io.emit("messages", rows);
  })["catch"](function (err) {
    console.log(err);
  });
  socket.on("new-message", function (message) {
    functions.addMessage(_objectSpread(_objectSpread({}, message), {}, {
      datetime: functions.timestamp
    }));
    functions.getMessages.then(function (rows) {
      io.emit("messages", rows);
    })["catch"](function (err) {
      console.log(err);
    });
  });
});
HTTP.listen(PORT, function () {
  console.log("magic is happening in http://localhost:".concat(PORT));
}).on("err", function (err) {
  return console.log("something is preventing us grow , more detail in: ".concat(err));
});
