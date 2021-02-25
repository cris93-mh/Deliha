const { sequelize } = require('../DATABASE/datab');

async function details(orders, orderId) {
	console.log("DETAILS////////////////////////",orders);
	const detailed_orders = await Promise.all(
		orders.map(async (order) => {
			console.log();
			const order_products = await sequelize.query(
				`SELECT * FROM products_per_order INNER JOIN products WHERE order_id = ${orderId} AND products_per_order.product_id = products.id`,
				{ type: sequelize.QueryTypes.SELECT }
			);
			order.products = order_products;
			return order;
		})
	);
	return detailed_orders;
}

module.exports = { details };  