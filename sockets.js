module.exports = (io) => {
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
};
