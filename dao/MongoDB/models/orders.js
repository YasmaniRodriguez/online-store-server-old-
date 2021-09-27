import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		code: { type: String },
		total_amount: { type: Number },
		total_quantity: { type: Number },
		buyer: { type: Array },
		products: { type: Array },
		status: { type: Number },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("orders", orderSchema);
