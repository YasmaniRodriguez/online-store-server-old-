import fs from "fs";
import moment from "moment";
const env = require("../../env.js");

class json {
	constructor() {}

	async buildSchema() {
		console.log("fantastic, everything is ready");
	}

	async addProducts(product) {}

	async getProducts(filters = null) {}

	async updateProducts(product = null, fields) {}

	async deleteProducts(product = null) {}

	async addMessages(message) {
		const file = "dao/FileSystem/data/messages.json";
		try {
			const data = fs.readFileSync(file);
			const json = JSON.parse(data.toString("utf-8"));
			json.push({
				...message,
				_id: json.length + 1,
				createdAt: moment(),
				updatedAt: moment(),
			});
			fs.writeFileSync(file, JSON.stringify(json, null, "\t"));
		} catch {
			try {
				fs.writeFileSync(file, JSON.stringify([{ ...message }]));
			} catch (err) {
				console.log(err);
			}
		}
	}

	async getMessages() {
		const file = "dao/FileSystem/data/messages.json";
		const normalize =
			require("../../normalization/handler.js").getNormalizedData;
		const schema = require("../../normalization/schemas/messages.js");
		const data = await fs.promises.readFile(file).then((content) => {
			let json = JSON.parse(content.toString("utf-8"));
			return json;
		});

		try {
			if (env.DATA_NORMALIZATION) {
				return normalize(data, schema);
			} else {
				return data;
			}
		} catch {
			try {
				fs.writeFileSync(file, JSON.stringify([]));
			} catch (err) {
				console.log(err);
			}
		}
	}

	async addOrders(order) {}

	async getOrders(order = null) {}
}

module.exports = json;
