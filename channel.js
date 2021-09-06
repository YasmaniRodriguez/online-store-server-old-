import fs from "fs";

class Channel {
	constructor(name) {
		this.name = name;
	}
	async addMessage(message) {
		try {
			const data = await fs.promises.readFile(this.name);
			const json = JSON.parse(data.toString("utf-8"));
			json.push({ ...message, id: json.length + 1 });
			try {
				await fs.promises.writeFile(
					this.name,
					JSON.stringify(json, null, "\t")
				);
			} catch (err) {
				throw new Error(err);
			}
		} catch (err) {
			try {
				await fs.promises.writeFile(
					this.name,
					JSON.stringify([{ ...message, id: 1 }])
				);
			} catch (err) {
				throw new Error(err);
			}
		}
	}

	async viewMessage() {
		try {
			let messages = await fs.promises.readFile(this.name, "utf-8");
			return messages;
		} catch (err) {
			throw new Error(err);
		}
	}
}

module.exports = Channel;
