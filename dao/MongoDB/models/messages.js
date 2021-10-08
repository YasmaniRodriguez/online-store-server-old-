import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		author: {
			email: { type: String },
			name: { type: String },
			lastname: { type: String },
			birthday: { type: String },
			alias: { type: String },
			avatar: { type: String },
		},
		message: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("messages", messageSchema);
