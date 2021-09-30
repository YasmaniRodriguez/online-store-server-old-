const env = require("../../env.js");

const knex = require("knex")({
	client: "mysql",
	connection: process.env.MYSQL_LOCAL_OPTIONS || env.MYSQL_LOCAL_OPTIONS,
});

class mysql {
	constructor() {}

	async buildSchema() {
		knex.schema.hasTable("products").then((exists) => {
			if (!exists) {
				return knex.schema
					.createTable("products", (table) => {
						table.increments("id").primary();
						table.string("code", 10).unique();
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
						table.string("email").unique();
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
						table.string("code").unique();
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

	async addOrders(order) {
		const { code, totalAmount, totalQuantity, status } = order;
		const buyer = {
			name: order.buyer.name,
			email: order.buyer.email,
			phone: order.buyer.phone,
		};
		const products = order.products;

		knex
			.transaction(function (t) {
				knex
					.transacting(t)
					.select("id")
					.from("buyers")
					.where("email", buyer.email)
					.then(function (i) {
						if (i.length === 0) {
							return knex.insert(buyer).into("buyers");
						} else {
							return i[0].id;
						}
					})
					.then(function (i) {
						return knex("orders")
							.insert({
								code: code,
								total_amount: totalAmount,
								total_quantity: totalQuantity,
								status: status,
								buyer: i,
							})
							.transacting(t);
					})
					.then(function (i) {
						products.forEach(
							(product) => (
								(product.order = i[0]),
								(product.product = knex("products")
									.where("code", product.product.code)
									.select("id"))
							)
						);

						return knex("orderrows").insert(products).transacting(t);
					})
					.then(t.commit)
					.catch(t.rollback);
			})
			.then(() => {
				console.log("order uploaded");
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async getOrders(order = null) {
		if (!order) {
			const data = (
				await knex("orders")
					.join("buyers", "orders.buyer", "=", "buyers.id")
					.join("orderrows", "orders.id", "=", "orderrows.order")
					.join("products", "products.id", "=", "orderrows.product")
					.select({
						id: "orders.id",
						trackingCode: "orders.code",
						totalAmount: "orders.total_amount",
						totalQuantity: "orders.total_quantity",
						status: "orders.status",
						buyerName: "buyers.name",
						buyerPhone: "buyers.phone",
						buyerEmail: "buyers.email",
						productCode: "products.code",
						productName: "products.name",
						productCategory: "products.category",
						productDescription: "products.description",
						productImage: "products.image",
						productPrice: "products.price",
						productStock: "products.stock",
						productQuantity: "orderrows.quantity",
						productAmount: "orderrows.amount",
					})
			).reduce((result, row) => {
				result[row.id] = result[row.id] || {
					trackingCode: row.trackingCode,
					totalAmount: row.totalAmount,
					totalQuantity: row.totalQuantity,
					status: row.status,
					buyer: {
						name: row.buyerName,
						phone: row.buyerPhone,
						email: row.buyerEmail,
					},
					products: [],
				};

				result[row.id].products.push({
					code: row.productCode,
					name: row.productName,
					category: row.productCategory,
					description: row.productDescription,
					image: row.productImage,
					price: row.productPrice,
					stock: row.productStock,
					quantity: row.productQuantity,
					amount: row.productAmount,
				});
				return result;
			}, {});
			return data;
		} else {
			const data = (
				await knex("orders")
					.join("buyers", "orders.buyer", "=", "buyers.id")
					.join("orderrows", "orders.id", "=", "orderrows.order")
					.join("products", "products.id", "=", "orderrows.product")
					.select({
						id: "orders.id",
						trackingCode: "orders.code",
						totalAmount: "orders.total_amount",
						totalQuantity: "orders.total_quantity",
						status: "orders.status",
						buyerName: "buyers.name",
						buyerPhone: "buyers.phone",
						buyerEmail: "buyers.email",
						productCode: "products.code",
						productName: "products.name",
						productCategory: "products.category",
						productDescription: "products.description",
						productImage: "products.image",
						productPrice: "products.price",
						productStock: "products.stock",
						productQuantity: "orderrows.quantity",
						productAmount: "orderrows.amount",
					})
					.where("orders.code", order)
			).reduce((result, row) => {
				result[row.id] = result[row.id] || {
					trackingCode: row.trackingCode,
					totalAmount: row.totalAmount,
					totalQuantity: row.totalQuantity,
					status: row.status,
					buyer: {
						name: row.buyerName,
						phone: row.buyerPhone,
						email: row.buyerEmail,
					},
					products: [],
				};

				result[row.id].products.push({
					code: row.productCode,
					name: row.productName,
					category: row.productCategory,
					description: row.productDescription,
					image: row.productImage,
					price: row.productPrice,
					stock: row.productStock,
					quantity: row.productQuantity,
					amount: row.productAmount,
				});
				return result;
			}, {});
			return data;
		}
	}
}

module.exports = mysql;
