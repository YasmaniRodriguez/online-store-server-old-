const socket = io();

// socket.on("products", (data) => {
// 	renderProduct(data);
// });

// const renderProduct = (data) => {
// 	let html = data
// 		.map((product, index) => {
// 			return `<li class="collection-item avatar">
// 					<img
// 						src=${product.image}
// 						alt=""
// 						class="circle"
// 					/>
// 					<span class="title">${product.name}</span>
// 					<p
// 						>${product.description} <br />
// 						$${product.price}
// 					</p>
// 					<a class="secondary-content" href="#"
// 						><i class="material-icons">delete</i></a
// 					>
// 				</li>`;
// 		})
// 		.join(" ");
// 	document.getElementById("products").innerHTML = html;
// };

// const newProduct = () => {
// 	let product = {
// 		name: document.getElementById("name").value,
// 		description: document.getElementById("description").value,
// 		price: document.getElementById("price").value,
// 		image: document.getElementById("image").value,
// 	};
// 	socket.emit("new-product", product);
// };

//////////////////////////////////////////////

socket.on("messages", (data) => {
	renderMessage(data);
});

const renderMessage = (data) => {
	let html = data
		.map((message) => {
			return `<li class="message-item">
						<p>${message.alias}</p>
						<p>[${message.datetime}]:</p>
						<p>${message.message}</p>
					</li>`;
		})
		.join(" ");
	document.getElementById("messages").innerHTML = html;
};

const newMessage = () => {
	let message = {
		alias: document.getElementById("alias").value,
		message: document.getElementById("message").value,
	};
	console.log(message);
	socket.emit("new-message", message);
};

document.addEventListener("DOMContentLoaded", function () {
	let myBtn = document.getElementById("myBtn");
	let myAlias = document.getElementById("alias");
	myBtn.disabled = true;
	myAlias.onchange = function () {
		myAlias.value ? (myBtn.disabled = false) : (myBtn.disabled = true);
	};
});
