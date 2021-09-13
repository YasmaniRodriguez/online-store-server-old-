import express from "express";
const router = express.Router();

const classes = require("../classes.js");
const functions = require("../functions.js");

var products = [];

//get all products
router.get("/products", (req, res) => {
	const myPromise = new Promise((resolve, reject) => {
		resolve(products);
	});
	myPromise
		.then((result) => {
			result.length === 0
				? res.json({ error: "there is not products" })
				: res.json({ products: result });
		})
		.catch((error) => res.json(error));
});

//get product by id
router.get("/products/:id", (req, res) => {
	const myPromise = new Promise((resolve, reject) => {
		resolve(products.find((product) => product.id == req.params.id));
	});
	myPromise
		.then((result) => {
			result === undefined
				? res.json({ error: "product was not found" })
				: res.json({ ...result });
		})
		.catch((error) => res.json(error));
});

//add product
router.post("/products", (req, res) => {
	console.log("agregando producto");
	const { code, name, description, image, price, stock } = req.body;
	const myPromise = new Promise((resolve, reject) => {
		resolve(
			products.push(
				new classes.Item(
					products.length + 1,
					code,
					name,
					description,
					image,
					price,
					stock,
					functions.timestamp
				)
			)
		);
	});
	myPromise
		.then(() => {
			res.json(req.body);
		})
		.catch((error) => res.json(error));
});

//update product by id
router.put("/products/:id", (req, res) => {
	const myPromise = new Promise((resolve, reject) => {
		resolve(products.find((product) => product.id == req.params.id));
	});
	myPromise
		.then((result) => {
			if (result === undefined) {
				res.json({ error: "product was not found" });
			} else {
				const { code, name, description, image, price, stock, timestamp } =
					req.body;
				//because send all parameters is not required:
				code ? (result.code = code) : result.code;
				name ? (result.name = name) : result.name;
				name ? (result.description = description) : result.description;
				image ? (result.image = image) : result.image;
				price ? (result.price = price) : result.price;
				stock ? (result.stock = stock) : result.stock;
				timestamp ? (result.timestamp = timestamp) : result.timestamp;
				res.json({ status: "OK", id: req.params.id, changes: req.body });
			}
		})
		.catch((error) => res.json(error));
});

//delete product
router.delete("/products/:id", (req, res) => {
	const myPromise = new Promise((resolve, reject) => {
		resolve(products.find((product) => product.id == req.params.id));
	});
	myPromise
		.then((result) => {
			if (result === undefined) {
				res.json({ error: "product was not found" });
			} else {
				let i = products.indexOf(result);
				if (i !== -1) {
					products.splice(i, 1);
				}
				res.json({ status: "OK", id: req.params.id, product: result });
			}
		})
		.catch((error) => res.json(error));
});

module.exports = router;
