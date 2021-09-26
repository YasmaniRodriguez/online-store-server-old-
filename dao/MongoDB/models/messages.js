import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
	alias: { type: String },
	message: { type: String },
	timestamps: { type: String },
});

module.exports = mongoose.model("messages", messageSchema);
