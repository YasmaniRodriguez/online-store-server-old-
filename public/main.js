const socket = io();
const { schema, normalize, denormalize } = normalizr;

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

const authorSchema = new schema.Entity("authors", {}, { idAttribute: "email" });

const messageSchema = new schema.Entity(
	"messages",
	{
		author: authorSchema,
	},
	{
		idAttribute: "_id",
	}
);

socket.on("messages", (data) => {
	const denormalizedData = denormalize(
		data.result,
		[messageSchema],
		data.entities
	);
	const compressionPercentage = (
		(JSON.stringify(data).length / JSON.stringify(denormalizedData).length) *
		100
	).toFixed(2);

	renderMessage(denormalizedData, compressionPercentage);
});

const renderMessage = (data, compression) => {
	let html = data
		.map((message) => {
			return `<li class="message-item">
						<p>${message.author.email}</p>
						<p>[${message.updatedAt}]:</p>
						<p>${message.message}</p>
						<img src=${message.author.avatar} alt="">
					</li>`;
		})
		.join(" ");
	document.getElementById("messages").innerHTML = html;
	document.getElementById(
		"compression-percentage"
	).innerHTML = `[Porcentaje de compresión: ${compression}]`;
};

const newMessage = () => {
	let message = {
		author: {
			name: document.getElementById("user-name").value,
			lastname: document.getElementById("user-lastname").value,
			birthday: document.getElementById("user-birthday").value,
			alias: document.getElementById("user-alias").value,
			email: document.getElementById("user-email").value,
			avatar: document.getElementById("user-avatar").value,
		},
		message: document.getElementById("message").value,
	};
	socket.emit("new-message", message);
};

document.addEventListener("DOMContentLoaded", function () {
	let myBtn = document.getElementById("myBtn");
	let myAlias = document.getElementById("user-alias");
	myBtn.disabled = true;
	myAlias.onchange = function () {
		myAlias.value ? (myBtn.disabled = false) : (myBtn.disabled = true);
	};
});
