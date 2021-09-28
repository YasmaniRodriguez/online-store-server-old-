import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		email: { type: String },
		message: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("messages", messageSchema);
