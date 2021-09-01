document.addEventListener("DOMContentLoaded", () => {
	const socket = io();
	const inp = document.querySelector("#message");
	socket.on("message", (data) => {
		console.log(data);
	});
	socket.on("user_keyup", (data) => {
		console.log(data);
	});
	inp.addEventListener("keyup", (e) => {
		if (e.keyCode == 13) {
			socket.emit("keyup", { value: e.target.value });
			e.target.value = "";
		}
	});
});
