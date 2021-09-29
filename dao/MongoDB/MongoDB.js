import mongoose from "mongoose";
const products = require("./models/products");
const orders = require("./models/orders");
const messages = require("./models/messages");
const env = require("../../env.js");

mongoose
	.connect(env.MONGO_LOCAL_URI, env.MONGO_LOCAL_OPTIONS || env.MONGO_CLOUD_URI)
	.then((connection) => {
		console.log("congrats, we are connected to mongo");
	})
	.catch((error) => {
		console.log(error.message);
	});

class mongo {
	constructor() {}

	async buildSchema() {
		console.log("fantastic, everything is ready");
	}

	async addProducts(product) {
		const newProduct = new products(product);
		await newProduct.save();
	}

	async getProducts(product = null) {
		if (!product) {
			const data = await products.find({});
			return data;
		} else {
			const data = await products.find({ code: { $eq: product } });
			return data;
		}
	}

	async updateProducts(product = null, fields) {
		if (!product) {
			await products.update({}, { $set: fields }, { multi: true });
		} else {
			await products.update(
				{ code: { $eq: product } },
				{ $set: fields },
				{ multi: true }
			);
		}
	}

	async deleteProducts(product = null) {
		if (!product) {
			await products.deleteMany({});
		} else {
			await products.deleteOne({ code: { $eq: product } });
		}
	}

	async addMessages(message) {
		const newMessage = new messages(message);
		await newMessage.save();
	}

	async getMessages() {
		const data = await messages.find({});
		return data;
	}

	async addOrders(order) {
		const newOrder = new orders(order);
		await newOrder.save();
	}

	async getOrders(order = null) {
		if (!order) {
			const data = await orders.find({});
			return data;
		} else {
			const data = await orders.find({ code: { $eq: order } });
			return data;
		}
	}
}

module.exports = mongo;
