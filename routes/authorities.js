const checkAuthority = (req, res, next) => {
	const method = req.method;
	const url = req.route.path;
	const { role } = req.user;

	switch (true) {
		//////////////////////////
		case method === "GET" && url === "/products":
			next();
			break;
		case method === "POST" && url === "/products":
			return role !== "owner"
				? res
						.status(403)
						.json({ error: "user don't have required permissions" })
				: next();
			break;
		case method === "PUT" ?? (url === "/products" || url === "/products:id"):
			return role !== "owner"
				? res
						.status(403)
						.json({ error: "user don't have required permissions" })
				: next();
			break;
		case method === "DELETE" ?? (url === "/products" || url === "/products:id"):
			return role !== "owner"
				? res
						.status(403)
						.json({ error: "user don't have required permissions" })
				: next();
			break;
		//////////////////////////
		case method === "GET" && url === "/messages":
			next();
			break;
		case method === "POST" && url === "/messages":
			next();
			break;
		case method === "PUT" ?? (url === "/messages" || url === "/messages/:id"):
			return role !== "owner"
				? res
						.status(403)
						.json({ error: "user don't have required permissions" })
				: next();
			break;
		case method === "DELETE" ??
			(url === "/messages" || url === "/messages/:id"):
			return role !== "owner"
				? res
						.status(403)
						.json({ error: "user don't have required permissions" })
				: next();
			break;
		//////////////////////////
		case method === "GET" && url === "/orders":
			next();
			break;
		case method === "POST" && url === "/orders":
			next();
			break;
		case method === "PUT" && url === "/orders":
			next();
			break;
		case method === "DELETE" ?? (url === "/orders" || url === "/orders/:id"):
			return role !== "owner"
				? res
						.status(403)
						.json({ error: "user don't have required permissions" })
				: next();
			break;
		//////////////////////////
		default:
			res.status(403).json({
				error: `for convination [method: ${method}, url: ${url}, role: ${role}] there are not defined permissions`,
			});
	}
};

module.exports = checkAuthority;
