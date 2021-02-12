

const { sequelize } = require('../DATABASE/datab');
const detailOrders = require('./conection');

async function createOrder(req, res) {
	try {
		const { payment_method, info_order } = req.body;
		console.log(info_order);
		const dataUser = req.token.username;
		console.log(dataUser);
		let total = 0;
		let product;

		const userId = await sequelize.query('SELECT id FROM users WHERE username=?', {
			replacements: [dataUser],
			type: sequelize.QueryTypes.SELECT,
		});

		const { id } = userId[0];

		for (i = 0; i < info_order.length; i++) {
			product = await sequelize.query('SELECT price, available, name  FROM products WHERE product_id = ?', {
				replacements: [info_order[i].product_id],
				type: sequelize.QueryTypes.SELECT,
			});

			if (product[0].available !== 0) total += product[0].price * info_order[i].quantity;
			else res.status(409).json({ ok: false, message: `Error, the product '${product[0].name}' isn't available` });
		}

		await sequelize.query('INSERT INTO orders (user_id, total, status, payment_method) values (?,?,?,?)', {
			replacements: [user_id, total, 'new', payment_method],
		});

		const response = await sequelize.query(
			'SELECT order_id FROM orders WHERE order_id=(SELECT max(order_id) FROM orders)',
			{ type: sequelize.QueryTypes.SELECT }
		);

		info_order.forEach(async (product) => {
			await sequelize.query('INSERT INTO orders_products (order_id, product_id, quantity ) values (?,?,?)', {
				replacements: [response[0].order_id, product.product_id, product.quantity],
			});
		});
		res.status(200).json({ ok: true, message: 'Generated order' });
	} catch (e) {
		res.status(404).json({ ok: false, message: 'Error, product not found' });
	}
}

async function getAllOrders(req, res) {
	let orders = await sequelize.query(
		`SELECT orders.order_id, orders.user_id, orders.total, orders.status, orders.payment_method, 
		orders.creation_date, users.username, users.full_name, users.email, users.phone, users.shipping_address 
		FROM orders INNER JOIN users ON orders.user_id = users.user_id`,
		{ type: sequelize.QueryTypes.SELECT }
	);

	const detailed_orders = await Promise.all(
		orders.map(async (order) => {
			const order_products = await sequelize.query(
				`SELECT * FROM orders_products INNER JOIN products WHERE order_id = ? 
				AND orders_products.product_id = products.product_id`,
				{ replacements: [order.order_id], type: sequelize.QueryTypes.SELECT }
			);
			order.products = order_products;
			return order;
		})
	);
	res.status(200).json({ ok: true, message: 'Successful request', data: detailed_orders });
}

async function getOrder(req, res) {
	try {
		const orderId = req.params.id;
		const dataUser = req.token.username;
		const orderUserExist = await sequelize.query('SELECT user_id, order_id FROM orders', {
			type: sequelize.QueryTypes.SELECT,
		});
		const findOrderId = orderUserExist.find((order) => order.order_id == orderId);

		if (findOrderId) {
			const userData = await sequelize.query('SELECT users.es_admin, user_id FROM users WHERE username= ? ', {
				replacements: [dataUser],
				type: sequelize.QueryTypes.SELECT,
			});

			if (userData[0].es_admin == 1) {
				let orders = await sequelize.query(
					`SELECT orders.order_id, orders.user_id, orders.total, orders.status, orders.payment_method, 
					orders.creation_date, users.username, users.full_name, users.email, users.phone, users.shipping_address 
					FROM orders INNER JOIN users ON orders.user_id = users.user_id WHERE orders.order_id = ${orderId}`,
					{ type: sequelize.QueryTypes.SELECT }
				);

				const detailed_orders = await detailOrders.details(orders, orderId);

				res.status(200).json({ ok: true, message: 'Successful request', data: detailed_orders[0] });
			} else {
				const findId = orderUserExist.find((order) => order.user_id == userData[0].user_id);

				if (findId) {
					let orders = await sequelize.query(
						`SELECT orders.order_id, orders.user_id, orders.total, orders.status, orders.payment_method, 
						orders.creation_date, users.username, users.full_name, users.email, users.phone, users.shipping_address 
						FROM orders INNER JOIN users ON orders.user_id =users.user_id WHERE orders.order_id = ${orderId} 
						AND orders.user_id =${userData[0].user_id}`,
						{ type: sequelize.QueryTypes.SELECT }
					);
					// When a person without permission tries to view other people's orders, This error is generated
					if (!orders[0]) throw new Error();

					const detailed_orders = await detailOrders.details(orders, orderId);

					res.status(200).json({ ok: true, message: 'Successful request', data: detailed_orders[0] });
				} else res.status(400).json({ ok: false, message: 'Error,  the user has no order' });
			}
		} else res.status(404).json({ ok: false, message: 'Error,  order not found' });
	} catch (e) {
		res.status(403).json({ ok: false, message: 'Error,  this user cannot see other people´s orders' });
	}
}

async function editOrder(req, res) {
	try {
		const { status } = req.body;
		const orderId = req.params.id;
		const orderExist = await sequelize.query('SELECT order_id FROM orders', { type: sequelize.QueryTypes.SELECT });
		const findOrderId = orderExist.find((order) => order.order_id == orderId);

		if (findOrderId) {
			await sequelize.query('UPDATE orders SET status = ? WHERE order_id = ?', { replacements: [status, orderId] });
			res.status(200).json({ ok: true, message: 'Successful status change' });
		} else throw new Error('Error, not found');
	} catch (e) {
		res.status(404).json({ ok: false, message: e.message });
	}
}

async function deleteOrder(req, res) {
	try {
		const orderId = await req.params.id;
		const orderExist = await sequelize.query('SELECT order_id FROM orders', {
			type: sequelize.QueryTypes.SELECT,
		});
		const findOrderId = orderExist.find((order) => order.order_id == orderId);

		if (findOrderId) {
			await sequelize.query('DELETE FROM orders_products WHERE order_id = ?', { replacements: [orderId] });
			await sequelize.query('DELETE FROM orders WHERE order_id = ?', { replacements: [orderId] });
			res.status(200).json({ ok: true, message: 'Order deleted' });
		} else throw new Error('Error, not found');
	} catch (e) {
		res.status(404).json({ ok: false, message: e.message });
	}
}

module.exports = { createOrder, getAllOrders, getOrder, editOrder, deleteOrder };