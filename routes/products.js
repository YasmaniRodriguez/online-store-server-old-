import express from "express";
const router = express.Router();

const myClass = require("../classes.js");

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
				: res.render("table", { products: result });
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
				: res.render("card", result);
		})
		.catch((error) => res.json(error));
});

//add product
router.post("/products", (req, res) => {
	const { name, description, price, image } = req.body;
	const myPromise = new Promise((resolve, reject) => {
		resolve(
			products.push(
				new myClass.Product(
					products.length + 1,
					name,
					description,
					price,
					image
				)
			)
		);
	});
	myPromise
		.then((result) => res.redirect("/"))
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
				const { name, description, price, image } = req.body;
				//because send all parameters is not required:
				name ? (result.name = name) : result.name;
				name ? (result.description = description) : result.description;
				price ? (result.price = price) : result.price;
				image ? (result.image = image) : result.image;
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
