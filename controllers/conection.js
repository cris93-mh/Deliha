const { sequelize } = require('../DATABASE/datab');

async function details(orders, orderId) {
	const detailed_orders = await Promise.all(
		orders.map(async (order) => {
			const order_products = await sequelize.query(
				`SELECT * FROM orders_products INNER JOIN products WHERE order_id = ${orderId} 
        AND orders_products.product_id = products.product_id`,
				{ type: sequelize.QueryTypes.SELECT }
			);
			order.products = order_products;
			return order;
		})
	);
	return detailed_orders;
}

module.exports = { details };  