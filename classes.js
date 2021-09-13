class Item {
	constructor(id, code, name, description, image, price, stock, timestamp) {
		this.id = id;
		this.name = code;
		this.name = name;
		this.description = description;
		this.image = image;
		this.price = price;
		this.stock = stock;
		this.timestamp = timestamp;
	}
}

class CartItem extends Item {
	constructor(quantity, amount) {
		this.product = quantity;
		this.product = amount;
	}

	set quantity(newQuantity) {
		this.quantity;
		this.amount();
	}

	set amount(newAmount) {
		this.quantity = newAmount;
	}
}

module.exports = { Item, CartItem };
