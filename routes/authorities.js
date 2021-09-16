const checkAuthority = (req, res, next) => {
	const { role } = req.user;
	if (role !== "owner") {
		return res
			.status(403)
			.json({ error: "user don't have required permissions" });
	} else {
		next();
	}
};

module.exports = checkAuthority;
