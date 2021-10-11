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
	/////////////////////////
	// const util = require("util");
	// function print(object) {
	// 	console.log(util.inspect(object, false, 12, true));
	// }
	// /////////////////////////
	// console.log("--------------NORMALIZED OBJECT----------------");
	// print(data);
	// console.log("--------------DENORMALIZED OBJECT----------------");
	// const denormalize = require("../normalization/handler.js").getDenormalizedData;
	// const schema = require("../normalization/schemas/messages.js");
	// print(denormalizedData);
	// console.log(`Porcentaje de compresión: ${((JSON.stringify(data).length / JSON.stringify(denormalizedData).length) * 100).toFixed(2)} %`);
	/////////////////////////

	const denormalizedData = denormalize(
		data.result,
		[messageSchema],
		data.entities
	);
	renderMessage(denormalizedData);
});

const renderMessage = (data) => {
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
