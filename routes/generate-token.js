import express from "express";
const router = express.Router();
const jwt = require("jsonwebtoken");
const settings = require("../env.js");

const users = [
	{
		username: "root",
		password: "password123root",
		role: "owner",
	},
	{
		username: "guest",
		password: "password123guest",
		role: "customer",
	},
];

router.post("/login", (req, res) => {
	const { username, password } = req.body;

	const user = users.find((u) => {
		return u.username === username && u.password === password;
	});

	if (user) {
		const accessToken = jwt.sign(
			{ username: user.username, role: user.role },
			process.env.PRIVATE_KEY || settings.PRIVATE_KEY,
			{ expiresIn: "60m" }
		);

		res.json({ accessToken });
	} else {
		res.send("wrong username or password");
	}
});

module.exports = router;
