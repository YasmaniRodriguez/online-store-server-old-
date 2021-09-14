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
	const { product, quantity, amount } = req.body;
	const myPromise = new Promise((resolve, reject) => {
		resolve(
			cart.push(
				new classes.CartItem(cart.length + 1, product, functions.timestamp),
				quantity()
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
				//because send all parameters is not required:
				result.quantity(quantity);
				res.json({ status: "OK", id: req.params.id, changes: req.body });
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
				res.json({ status: "OK", id: req.params.id, cart: result });
			}
		})
		.catch((error) => res.json(error));
});

module.exports = router;
