import express from "express";
const router = express.Router();

const checkAuthority = require("./authorities.js");

router.get("/messages", checkAuthority, (req, res) => {
	const DAO = req.app.get("dataHandler");
	const myPromise = new Promise((resolve, reject) => {
		resolve(DAO.getMessages());
	});
	myPromise
		.then((result) => {
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
