const env = require("../../env.js");

const knex = require("knex")({
	client: "mysql",
	connection: env.MYSQL_LOCAL_OPTIONS,
});

class mysql {
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
						table.integer("status");
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
						table
							.integer("product")
							.unsigned()
							.references("id")
							.inTable("products");
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
						table.string("email");
						table.string("message");
						table.timestamps(true, true);
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

	async addProducts(product) {
		knex
			.insert([
				{
					code: product.code,
					name: product.name,
					category: product.category,
					description: product.description,
					image: product.image,
					price: product.price,
					stock: product.stock,
				},
			])
			.into("products")
			.then(() => {
				console.log("product uploaded");
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async getProducts(product = null) {
		if (!product) {
			const data = await knex.select().from("products");
			return data;
		} else {
			const data = await knex("products").where("code", product).select();
			return data;
		}
	}

	async updateProducts(product = null, fields) {
		if (!product) {
			await knex("products").update(fields);
		} else {
			knex("products")
				.where("code", product)
				.update(fields)
				.then(() => {
					console.log("product updated");
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	async deleteProducts(product = null) {
		if (!product) {
			await knex("products").del();
		} else {
			knex("products")
				.where("code", product)
				.del()
				.then(() => {
					console.log("product removed");
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	async addMessages(message) {
		knex
			.insert([
				{
					emial: message.email,
					message: message.message,
				},
			])
			.into("messages")
			.then(() => {
				console.log("message delivered");
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async getMessages() {
		knex.select("email", "message", "updated_at").from("messages");
	}

	async addOrders(order) {}

	async getOrders(order = null) {
		if (!order) {
			const data = await knex("orders")
				.join("buyers", "orders.buyer", "=", "buyers.id")
				.join("orderrows", "orders.id", "=", "orderrows.order")
				.join("products", "products.id", "=", "orderrows.product")
				.select(
					"orders.code",
					"orders.total_amount",
					"orders.total_quantity",
					"orders.status",
					"buyers.name",
					"buyers.phone",
					"buyers.email",
					"orderrows.quantity",
					"orderrows.amount",
					"products.code",
					"products.name",
					"products.category",
					"products.description",
					"products.image",
					"products.price",
					"products.stock"
				);
			return data;
		} else {
			const data = await knex("orders")
				.where("code", order)
				.join("buyers", "orders.buyer", "=", "buyers.id")
				.join("orderrows", "orders.id", "=", "orderrows.order")
				.join("products", "products.id", "=", "orderrows.product")
				.select(
					"orders.code",
					"orders.total_amount",
					"orders.total_quantity",
					"orders.status",
					"buyers.name",
					"buyers.phone",
					"buyers.email",
					"orderrows.quantity",
					"orderrows.amount",
					"products.code",
					"products.name",
					"products.category",
					"products.description",
					"products.image",
					"products.price",
					"products.stock"
				);
			return data;
		}
	}
}

module.exports = mysql;
