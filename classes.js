class Item {
	constructor(code, name, description, image, price, stock, timestamp) {
		this.code = code;
		this.name = name;
		this.description = description;
		this.image = image;
		this.price = price;
		this.stock = stock;
		this.timestamp = timestamp;
	}
}

class CartItem {
	constructor(id, product, quantity, timestamp) {
		this.id = id;
		this.product = product;
		this.quantity = quantity;
		this.amount = this.calcAmount();
		this.timestamp = timestamp;
	}
	calcAmount() {
		return this.quantity * this.product.price;
	}

	setQuantity(newQuantity) {
		this.quantity = newQuantity;
		this.amount(this.quantity * this.product.price);
	}
}

module.exports = { Item, CartItem };
