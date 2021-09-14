class Item {
	constructor(id, code, name, description, image, price, stock, timestamp) {
		this.id = id;
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
	constructor(id, product, quantity, amount, timestamp) {
		this.id = id;
		this.product = product;
		this.quantity = quantity;
		this.amount = amount;
		this.timestamp = timestamp;
	}

	set quantity(newQuantity) {
		this.quantity;
		this.amount(this.quantity * this.product.price);
	}

	set amount(newAmount) {
		this.quantity = newAmount;
	}
}

module.exports = { Item, CartItem };
