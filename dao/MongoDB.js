const mongoose = require("mongoose");
const products = require("./mongooseModels/products");
const env = require("../settings/env.js");

mongoose
	.connect(env.MONGO_URI)
	.then((connection) => {
		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		console.log(error.message);
	});

class mongo {
	constructor() {}

	createProducts() {
		let product = {
			code: "nj-vOB",
			name: "Naranja",
			category: "Frutas y Verduras",
			description: "De Ombligo",
			image:
				"https://cdn3.iconfinder.com/data/icons/fruits-52/150/icon_fruit_laranja-256.png",
			price: "60.00",
			stock: "500",
		};

		const productSaveModel = new products(product);
		let productSave = productSaveModel.save();
	}
}

module.exports = mongo;
