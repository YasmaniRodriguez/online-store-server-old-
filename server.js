"use strict";

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var server = (0, _express["default"])();

var http = require("http").Server(server);

var io = require("socket.io")(http);

var port = process.env.PORT || 8080;

var products = require("./routes/products");

var cart = require("./routes/cart");

var functions = require("./functions.js"); ///////////////////////////////////////////////////////////////


server.use(_express["default"].json());
server.use(_express["default"].urlencoded({
  extended: true
}));
server.use(_express["default"]["static"](__dirname + "/public"));
server.use("/endpoint", products);
server.use("/endpoint", cart);
server.get("/", function (req, res) {
  res.status(200).sendFile("index.html", {
    root: __dirname + "/public"
  });
});
io.on("connection", function (socket) {
  console.log("connection_identifier: ".concat(socket.id));
  getMessages();
  socket.on("new-message", function (message) {
    addMessage(_objectSpread(_objectSpread({}, message), {}, {
      datetime: functions.timestamp
    }));
    getMessages();
  });
});
http.listen(port, function () {
  console.log("magic is happening in http://localhost:".concat(port));
}).on("error", function (error) {
  return console.log("something is preventing us grow , more detail in: ".concat(error));
}); ///////////////////////////////////////////////////////////////

var _require = require("./odbc"),
    mysql = _require.mysql,
    sqlite = _require.sqlite;

var store = require("knex")(mysql);

var chat = require("knex")(sqlite);

(function () {
  store.schema.hasTable("products").then(function (exists) {
    if (!exists) {
      return store.schema.createTable("products", function (table) {
        table.increments("id").primary();
        table.string("name", 20);
        table.string("description", 50);
        table.decimal("price");
        table.string("image");
      }).then(function () {
        return console.log("congrats, store db schema is created successfully!");
      })["catch"](function (err) {
        console.log(err);
      })["finally"](function () {
        store.destroy();
      });
    } else {
      console.log("fantastic, store db schema already exists!");
    }
  });
})();

(function () {
  chat.schema.hasTable("messages").then(function (exists) {
    if (!exists) {
      return chat.schema.createTable("messages", function (table) {
        table.increments("id").primary();
        table.string("alias", 20);
        table.string("datetime", 50);
        table.string("message", 250);
      }).then(function () {
        return console.log("congrats, chat db schema is created successfully!");
      })["catch"](function (err) {
        console.log(err);
      })["finally"](function () {
        chat.destroy();
      });
    } else {
      console.log("fantastic, chat db schema already exists!");
    }
  });
})();

var addMessage = function addMessage(message) {
  chat.insert([{
    alias: message.alias,
    datetime: message.datetime,
    message: message.message
  }]).into("messages").then(function () {
    console.log("message delivered");
  })["catch"](function (err) {
    console.log(err);
  });
};

var getMessages = function getMessages() {
  chat.from("messages").select("alias", "datetime", "message").orderBy("id").then(function (rows) {
    io.emit("messages", rows);
  })["catch"](function (err) {
    console.log(err);
  });
}; ///////////////////////////////////////////////////////////////
