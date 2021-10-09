import express from "express";
const router = express.Router();

const checkAuthority = require("./authorities.js");

router.get("/messages", checkAuthority, (req, res) => {
	const DAO = req.app.get("dataHandler");
	/////////////////////////
	const util = require("util");
	function print(object) {
		console.log(util.inspect(object, false, 12, true));
	}
	/////////////////////////
	const myPromise = new Promise((resolve, reject) => {
		resolve(DAO.getMessages());
	});
	myPromise
		.then((result) => {
			/////////////////////////
			console.log("--------------NORMALIZED OBJECT----------------");
			print(result);
			console.log("--------------DENORMALIZED OBJECT----------------");
			const denormalize =
				require("../normalization/handler.js").getDenormalizedData;
			const schema = require("../normalization/schemas/messages.js");
			const denormalizedData = denormalize(
				result.result,
				schema,
				result.entities
			);
			print(denormalizedData);
			const a = JSON.stringify(result).length;
			const b = JSON.stringify(denormalizedData).length;
			console.log(`Porcentaje de compresión: ${((a / b) * 100).toFixed(2)} %`);
			/////////////////////////
			result.length === 0
				? res.json({ error: "there is not messages" })
				: res.json({ messages: result });
		})
		.catch((error) => res.json(error));
});

router.post("/messages", checkAuthority, (req, res) => {
	const DAO = req.app.get("dataHandler");
	const message = req.body;
	const myPromise = new Promise((resolve, reject) => {
		resolve(DAO.addMessages(message));
	});
	myPromise
		.then(() => {
			res.json({ message: "message uploaded" });
		})
		.catch((error) => res.json(error));
});

module.exports = router;
