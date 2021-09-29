import express from "express";
const router = express.Router();
const checkAuthority = require("./authorities.js");

router.get("/orders", checkAuthority, (req, res) => {
	const dataHandler = req.app.get("dataHandler");
});

router.get("/orders/:id", checkAuthority, (req, res) => {
	const dataHandler = req.app.get("dataHandler");
});

router.post("/orders", checkAuthority, (req, res) => {
	const dataHandler = req.app.get("dataHandler");
});

router.put("/orders/:id", checkAuthority, (req, res) => {
	const dataHandler = req.app.get("dataHandler");
});

router.delete("/orders/:id", checkAuthority, (req, res) => {
	const dataHandler = req.app.get("dataHandler");
});

module.exports = router;
