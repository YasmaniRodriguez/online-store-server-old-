const knex = require("knex")({
	client: "sqlite3",
	connection: {
		filename: "./data/sqlite/store.sqlite",
	},
	useNullAsDefault: true,
});

class sqlite3 {
	constructor() {}

	buildSchema() {
		knex.schema.hasTable("products").then((exists) => {
			if (!exists) {
				return knex.schema
					.createTable("products", (table) => {
						table.increments("id").primary();
						table.string("code", 10);
						table.string("name", 20);
						table.string("category", 20);
						table.string("description", 20);
						table.string("image");
						table.decimal("price");
						table.integer("stock");
						table.timestamps(true, true);
					})
					.then(() =>
						console.log("congrats, products table is created successfully!")
					)
					.catch((err) => {
						console.log(err);
					})
					.finally(() => {
						knex.destroy();
					});
			} else {
				console.log("fantastic, products table already exists!");
			}
		});

		knex.schema.hasTable("buyers").then((exists) => {
			if (!exists) {
				return knex.schema
					.createTable("buyers", (table) => {
						table.increments("id").primary();
						table.string("name");
						table.string("email");
						table.string("phone");
						table.timestamps(true, true);
					})
					.then(() =>
						console.log("congrats, buyers table is created successfully!")
					)
					.catch((err) => {
						console.log(err);
					})
					.finally(() => {
						knex.destroy();
					});
			} else {
				console.log("fantastic, buyers table already exists!");
			}
		});

		knex.schema.hasTable("orders").then((exists) => {
			if (!exists) {
				return knex.schema
					.createTable("orders", (table) => {
						table.increments("id").primary();
						table.string("code", 20);
						table.decimal("total_amount");
						table.decimal("total_quantity");
						table
							.integer("buyer")
							.unsigned()
							.references("id")
							.inTable("buyers");
						table.timestamps(true, true);
					})
					.then(() =>
						console.log("congrats, orders table is created successfully!")
					)
					.catch((err) => {
						console.log(err);
					})
					.finally(() => {
						knex.destroy();
					});
			} else {
				console.log("fantastic, orders table already exists!");
			}
		});

		knex.schema.hasTable("orderrows").then((exists) => {
			if (!exists) {
				return knex.schema
					.createTable("orderrows", (table) => {
						table.increments("id").primary();
						table.string("product", 20);
						table.decimal("quantity");
						table.decimal("amount");
						table.timestamps(true, true);
						table
							.integer("order")
							.unsigned()
							.references("id")
							.inTable("orders");
					})
					.then(() =>
						console.log("congrats, orderrows table is created successfully!")
					)
					.catch((err) => {
						console.log(err);
					})
					.finally(() => {
						knex.destroy();
					});
			} else {
				console.log("fantastic, orderrows table already exists!");
			}
		});

		knex.schema.hasTable("messages").then((exists) => {
			if (!exists) {
				return knex.schema
					.createTable("messages", (table) => {
						table.increments("id").primary();
						table.string("alias");
						table.timestamps(true, true);
						table.string("message");
					})
					.then(() =>
						console.log("congrats, messages table is created successfully!")
					)
					.catch((err) => {
						console.log(err);
					})
					.finally(() => {
						knex.destroy();
					});
			} else {
				console.log("fantastic, messages table already exists!");
			}
		});
	}
}

module.exports = sqlite3;
