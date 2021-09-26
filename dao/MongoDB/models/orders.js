import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
	code: { type: String },
	total_amount: { type: Number },
	total_quantity: { type: Number },
	buyer: { type: String },
	timestamps: { type: String },
	products: { type: Array },
});

module.exports = mongoose.model("orders", orderSchema);
