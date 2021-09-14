const jwt = require("jsonwebtoken");
const settings = require("../settings/config.js");

const verifyToken = (req, res, next) => {
	const auth = req.headers.authorization;
	if (!auth) return res.status(401).json({ error: "access denied" });
	try {
		const token = auth.split(" ")[1];
		const verified = jwt.verify(
			token,
			process.env.PRIVATE_KEY || settings.PRIVATE_KEY
		);
		req.user = verified;
		next();
	} catch (error) {
		res.status(400).json({ error: "invalid token" });
	}
};

module.exports = verifyToken;
