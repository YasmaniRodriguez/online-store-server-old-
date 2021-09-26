import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		code: { type: String, require: true, max: 100 },
		name: { type: String, require: true, max: 100 },
		category: { type: String, require: true, max: 100 },
		description: { type: String, require: true, max: 100 },
		image: { type: String, require: true },
		price: { type: Number, require: true },
		stock: { type: Number, require: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("products", productSchema);
