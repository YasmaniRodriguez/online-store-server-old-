const mongoose = require("mongoose");
const products = require("./mongooseModels/products");
const orders = require("./mongooseModels/orders");
const messages = require("./mongooseModels/messages");
const env = require("../settings/env.js");

mongoose
	//.connect(env.MONGO_CLOUD_URI)
	.connect(env.MONGO_LOCAL_URI, env.MONGO_LOCAL_OPTIONS)
	.then((connection) => {
		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		console.log(error.message);
	});

class mongo {
	constructor() {}

	buildSchema() {
		console.log(
			"everything is ready, but mongo does not require build the schema"
		);
	}

	addProducts(product) {
		const newProduct = new products(product);
		return newProduct.save();
	}

	addMessages(message) {
		const newMessage = new messages(message);
		return newMessage.save();
	}

	addOrders(order) {
		const newOrder = new messages(order);
		return newOrder.save();
	}
}

module.exports = mongo;
