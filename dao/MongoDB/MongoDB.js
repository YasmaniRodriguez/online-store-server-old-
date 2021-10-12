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

	async getProducts(filters = null) {
		if (Object.keys(filters).length === 0) {
			const data = await products.find({}).lean();
			return data;
		} else {
			let match = new Object();
			let range = new Object();

			for (let key in filters) {
				typeof filters[key] === "object"
					? (range[key] = { $gte: filters[key].gte, $lte: filters[key].lte })
					: (match[key] = filters[key]);
			}

			const data = await products.find({ ...match, ...range }).lean();
			return data;
		}
	}

	async updateProducts(product = null, fields) {
		return !product
			? await products.update({}, { $set: fields }, { multi: true })
			: await products.update(
					{ code: { $eq: product } },
					{ $set: fields },
					{ multi: true }
			  );
	}

	async deleteProducts(product = null) {
		return !product
			? await products.deleteMany({})
			: products.deleteOne({ code: { $eq: product } });
	}

	async addMessages(message) {
		const newMessage = new messages(message);
		await newMessage.save();
	}

	async getMessages() {
		const normalize =
			require("../../normalization/handler.js").getNormalizedData;
		const schema = require("../../normalization/schemas/messages.js");
		const data = await messages.find({}).lean();

		return env.DATA_NORMALIZATION ? normalize(data, schema) : data;
	}

	async addOrders(order) {
		const newOrder = new orders(order);
		await newOrder.save();
	}

	async getOrders(order = null) {
		return !order
			? await orders.find({}).lean()
			: orders.find({ code: { $eq: order } }).lean();
	}
}

module.exports = mongo;
