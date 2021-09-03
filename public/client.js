const socket = io();

socket.on("products", (data) => {
	console.log(data);
});

const addProduct = () => {
	var product = {
		name: document.getElementById("name").value,
		description: document.getElementById("description").value,
		price: document.getElementById("price").value,
		image: document.getElementById("image").value,
	};
	socket.emit("new-product", product);
};
