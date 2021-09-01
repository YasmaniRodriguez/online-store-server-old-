const socket = io();

socket.on("saludo", (data) => {
	console.log(data);
	socket.emit("saludo", "hola servidor");
});
