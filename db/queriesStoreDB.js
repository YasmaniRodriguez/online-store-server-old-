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
				.then(() => console.log("table created"))
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					db.destroy();
				});
		}
	});
};

module.exports = { dbCreateSchema };
