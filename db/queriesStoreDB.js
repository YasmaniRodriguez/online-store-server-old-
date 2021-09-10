const { mysql } = require("./odbc");
const db = require("knex")(mysql);

const dbCreateSchema = () => {
	db.schema.hasTable("products").then((exists) => {
		if (!exists) {
			return db.schema
				.createTable("products", (table) => {
					table.increments("id").primary();
					table.string("name", 20);
					table.string("description", 50);
					table.decimal("price");
					table.string("image");
				})
				.then(() =>
					console.log("Congrats, Store DB Schema is created successfully!")
				)
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					db.destroy();
				});
		} else {
			console.log("Fantastic, Store DB Schema already exists!");
		}
	});
};

module.exports = { dbCreateSchema };
