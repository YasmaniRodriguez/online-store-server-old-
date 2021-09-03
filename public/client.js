const socket = io();

socket.on("products", (data) => {
	render(data);
});

const render = (data) => {
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
	<a class="secondary-content" href="#!"
		><i class="material-icons">delete</i></a
	>
</li>`;
	});
	document.getElementById("products").innerHTML = html;
};

const addProduct = () => {
	var product = {
		name: document.getElementById("name").value,
		description: document.getElementById("description").value,
		price: document.getElementById("price").value,
		image: document.getElementById("image").value,
	};
	socket.emit("new-product", product);
};
