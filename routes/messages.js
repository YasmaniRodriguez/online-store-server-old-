import express from "express";
const router = express.Router();

const checkAuthority = require("./authorities.js");
const myDataHandler = require("./data-handler.js").getDataHandler();
const DataPersistenceMode = require(myDataHandler);
const DAO = new DataPersistenceMode();

router.get("/messages", (req, res, next) => {});

router.post("/messages", checkAuthority, (req, res, next) => {
	// grab the id from the request
	const socketId = req.body.message.socketId;

	// get the io object ref
	const io = req.app.get("socketio");

	// create a ref to the client socket
	const senderSocket = io.sockets.connected[socketId];

	Message.create(req.body.message)
		.then((message) => {
			// in case the client was disconnected after the request was sent
			// and there's no longer a socket with that id
			if (senderSocket) {
				// use broadcast.emit to message everyone except the original
				// sender of the request !!!
				senderSocket.broadcast.emit("message broadcast", { message });
			}
			res.status(201).json({ message: message.toObject() });
		})
		.catch(next);
});
