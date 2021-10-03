import express from "express";
const router = express.Router();

const classes = require("../classes.js");
const checkAuthority = require("./authorities.js");

//get all products

router.get("/products", checkAuthority, (req, res) => {
	const dataHandler = req.app.get("dataHandler");
	const filters = req.query;
	const myPromise = new Promise((resolve, reject) => {
		resolve(dataHandler.getProducts(filters));
	});
	myPromise
		.then((result) => {
			result.length === 0
				? res.json({ error: "there is not products" })
				: res.json({ products: result });
		})
		.catch((error) => res.json(error));
});

//get product by id: refactorizar para que soporte cualquier parametro

router.get("/products/:id", checkAuthority, (req, res) => {
	const dataHandler = req.app.get("dataHandler");
	const myPromise = new Promise((resolve, reject) => {
		resolve(dataHandler.getProducts(req.params.id));
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

router.post("/products", checkAuthority, (req, res) => {
	const dataHandler = req.app.get("dataHandler");
	const { code, name, category, description, image, price, stock } = req.body;
	const product = new classes.Product(
		code,
		name,
		category,
		description,
		image,
		price,
		stock
	);
	const myPromise = new Promise((resolve, reject) => {
		resolve(dataHandler.addProducts(product));
	});
	myPromise
		.then(() => {
			res.json({ message: "product uploaded" });
		})
		.catch((error) => res.json(error));
});

//update product by id: refactorizar para poder actualizar todos

router.put("/products/:id", checkAuthority, (req, res) => {
	const dataHandler = req.app.get("dataHandler");
	const myPromise = new Promise((resolve, reject) => {
		const record = req.params.id;
		const fields = req.body;
		resolve(dataHandler.updateProducts(record, fields));
	});
	myPromise
		.then(() => {
			res.json({ message: "product updated" });
		})
		.catch((error) => res.json(error));
});

//delete product: refactorizar para poder borrar todos

router.delete("/products/:id", checkAuthority, (req, res) => {
	const dataHandler = req.app.get("dataHandler");
	const myPromise = new Promise((resolve, reject) => {
		const record = req.params.id;
		console.log(record);
		resolve(dataHandler.deleteProducts(record));
	});
	myPromise
		.then(() => {
			res.json({ message: "product removed" });
		})
		.catch((error) => res.json(error));
});

module.exports = router;
