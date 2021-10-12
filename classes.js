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

class Profile {
	constructor(name, lastname, birthday, alias, email, avatar) {
		this.name = name;
		this.lastname = lastname;
		this.birthday = birthday;
		this.alias = alias;
		this.email = email;
		this.avatar = avatar;
	}

	// set name(newValue) {
	// 	this.name = newValue;
	// }

	// set lastname(newValue) {
	// 	this.lastname = newValue;
	// }

	// set birthday(newValue) {
	// 	this.birthday = newValue;
	// }

	// set alias(newValue) {
	// 	this.alias = newValue;
	// }

	// set email(newValue) {
	// 	this.email = newValue;
	// }

	// set avatar(newValue) {
	// 	this.avatar = newValue;
	// }
}

module.exports = { Product, OrderRow, Profile };
