import express from "express";
const router = express.Router();

const classes = require("../classes.js");
const functions = require("../functions.js");

var products = [];

//get all products
router.get("/products", (req, res) => {
	const myPromise = new Promise((resolve, reject) => {
		resolve(functions.select_all_products);
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
		resolve(functions.select_one_products(req.params.id));
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
	const { role } = req.user;
	if (role !== "owner") {
		return res
			.status(403)
			.json({ error: "user don't have required permissions" });
	} else {
		const { code, name, description, image, price, stock } = req.body;
		const product = new classes.Item(
			code,
			name,
			description,
			image,
			price,
			stock,
			functions.timestamp
		);
		const myPromise = new Promise((resolve, reject) => {
			resolve(functions.insert_into_products(product));
		});
		myPromise
			.then(() => {
				res.json(req.body);
			})
			.catch((error) => res.json(error));
	}
});

//update product by id
router.put("/products/:id", (req, res) => {
	const { role } = req.user;
	if (role !== "owner") {
		return res
			.status(403)
			.json({ error: "user don't have required permissions" });
	} else {
		const myPromise = new Promise((resolve, reject) => {
			const record = req.params.id;
			const fields = req.body;
			resolve(functions.update_one_products(record, fields));
		});
		myPromise
			.then(() => {
				res.json(req.body);
			})
			.catch((error) => res.json(error));
	}
});

//delete product
router.delete("/products/:id", (req, res) => {
	const { role } = req.user;
	if (role !== "owner") {
		return res
			.status(403)
			.json({ error: "user don't have required permissions" });
	} else {
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
	}
});

module.exports = router;
