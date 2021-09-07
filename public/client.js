const socket = io();

socket.on("products", (data) => {
	renderProduct(data);
});

const renderProduct = (data) => {
	var html = data.map((product, index) => {
		return `<li class="collection-item avatar">
					<img
						src=${product.image}
						alt=""
						class="circle"
					/>
					<span class="title">${product.name}</span>
					<p
						>${product.description} <br />
						$${product.price}
					</p>
					<a class="secondary-content" href="#"
						><i class="material-icons">delete</i></a
					>
				</li>`;
	});
	document.getElementById("products").innerHTML = html;
};

const newProduct = () => {
	var product = {
		name: document.getElementById("name").value,
		description: document.getElementById("description").value,
		price: document.getElementById("price").value,
		image: document.getElementById("image").value,
	};
	socket.emit("new-product", product);
};

//////////////////////////////////////////////

// socket.on("messages", (data) => {
// 	renderMessage(data);
// });

// const renderMessage = (data) => {
// 	var html = data.map((message, index) => {
// 		return `<li class="message-item">
// 					<p>${message.email}</p>
// 					<p>[${message.datetime}]:</p>
// 					<p>${message.message}</p>
// 				</li>`;
// 	});
// 	document.getElementById("messages").innerHTML = html;
// };

// const newMessage = (e) => {
// 	e.preventDefault();
// 	var message = {
// 		user: document.getElementById("email").value,
// 		text: document.getElementById("message").value,
// 	};
// 	socket.emit("add-new-message", message);
// 	return false;
// };
