import mongoose from "mongoose";

const productsCollection = "products";

const ProductSchema = new mongoose.Schema({
	code: { type: String, require: true, max: 100 },
	name: { type: String, require: true, max: 100 },
	category: { type: String, require: true, max: 100 },
	description: { type: String, require: true, max: 100 },
	image: { type: String, require: true },
	price: { type: Number, require: true },
	stock: { type: Number, require: true },
});

const products = mongoose.model(productsCollection, ProductSchema);

module.exports = products;
