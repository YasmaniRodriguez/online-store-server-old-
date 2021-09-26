class Product {
	constructor(
		code,
		name,
		category,
		description,
		image,
		price,
		stock,
		timestamp
	) {
		this.code = code;
		this.name = name;
		this.category = category;
		this.description = description;
		this.image = image;
		this.price = price;
		this.stock = stock;
		this.timestamp = timestamp;
	}
}

class OrderRow {
	constructor(row, product, quantity, timestamp) {
		this.row = row;
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
		this.amount = this.calcAmount();
	}
}

module.exports = { Product, OrderRow };
