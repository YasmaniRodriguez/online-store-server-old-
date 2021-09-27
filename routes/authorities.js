const checkAuthority = (req, res, next) => {
	//refactorizar para capturar la ruta y el metodo y a partir de ahí definir los privilegios
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
