import fs from "fs";

const filepath = "./data/fs";

class file {
	constructor() {}

	buildSchema() {
		try {
			fs.writeFileSync(filepath + "/products.json", "[]");
			fs.writeFileSync(filepath + "/orders.json", "[]");
			fs.writeFileSync(filepath + "/messages.json", "[]");
		} catch {
			try {
				fs.mkdirSync(filepath, { recursive: true }, (err) => {
					if (err) throw err;
				});
			} catch (err) {
				if (err) throw err;
			}
		}
	}
}

module.exports = file;
