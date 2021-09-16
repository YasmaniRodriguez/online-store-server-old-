import express from "express";
const router = express.Router();

const classes = require("../classes.js");
const functions = require("../functions.js");

var cart = [];

//get all products
router.get("/cart", (req, res) => {
	const myPromise = new Promise((resolve, reject) => {
		resolve(cart);
	});
	myPromise
		.then((result) => {
			result.length === 0
				? res.json({ error: "cart is empty" })
				: res.json({ cart: result });
		})
		.catch((error) => res.json(error));
});

//get product by id
router.get("/cart/:id", (req, res) => {
	const myPromise = new Promise((resolve, reject) => {
		resolve(cart.find((row) => row.product.id == req.params.id));
	});
	myPromise
		.then((result) => {
			result === undefined
				? res.json({ error: "this product is not in the cart" })
				: res.json({ ...result });
		})
		.catch((error) => res.json(error));
});

//add product
router.post("/cart", (req, res) => {
	const { product, quantity } = req.body;
	const myPromise = new Promise((resolve, reject) => {
		resolve(functions.select_one_products(product));
	});
	myPromise
		.then((result) => {
			cart.push(
				new classes.CartItem(
					cart.length + 1,
					result[0],
					quantity,
					"null",
					functions.timestamp
				)
			);
			res.json({ message: "product uploaded" });
		})
		.catch((error) => res.json(error));
});

//update product by id
router.put("/cart/:id", (req, res) => {
	const myPromise = new Promise((resolve, reject) => {
		resolve(cart.find((row) => row.product.id == req.params.id));
	});
	myPromise
		.then((result) => {
			if (result === undefined) {
				res.json({ error: "this product is not in the cart" });
			} else {
				const { quantity } = req.body;
				result.setQuantity(quantity);
				res.json({ message: "product updated" });
			}
		})
		.catch((error) => res.json(error));
});

//delete product
router.delete("/cart/:id", (req, res) => {
	const myPromise = new Promise((resolve, reject) => {
		resolve(cart.find((row) => row.product.id == req.params.id));
	});
	myPromise
		.then((result) => {
			if (result === undefined) {
				res.json({ error: "this product is not in the cart" });
			} else {
				let i = cart.indexOf(result);
				if (i !== -1) {
					cart.splice(i, 1);
				}
				res.json({ message: "product removed" });
			}
		})
		.catch((error) => res.json(error));
});

module.exports = router;
