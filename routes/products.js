import express from "express";
const router = express.Router();
const faker = require("faker/locale/en");

const classes = require("../classes.js");
const checkAuthority = require("./authorities.js");

//get all available products

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

router.get("/fake-products", checkAuthority, (req, res) => {
	const p_qty = Object.values(req.query)[0];

	function generateFakeProducts(qty = 10) {
		const products = [];
		for (let i = 1; i <= qty; i++) {
			products.push({
				id: i,
				code: faker.datatype.uuid(),
				name: faker.commerce.product(),
				category: faker.commerce.productName(),
				description: faker.commerce.productDescription(),
				image: faker.image.food(),
				price: faker.commerce.price(),
				stock: faker.datatype.number(),
			});
		}
		return products;
	}

	const fakeProducts = generateFakeProducts(p_qty);

	fakeProducts.length === 0
		? res.json({ error: "there is not products" })
		: res.json({
				products: fakeProducts,
		  });
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
