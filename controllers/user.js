
const { sequelize } = require('../DATABASE/datab');
const { key } = require('../configurations/configurations');
const jwt = require('jsonwebtoken');

async function createUser(req, res) {
	let { username, full_name, email, phone, shipping_address, password, es_admin } = await req.body;
	if (!es_admin) es_admin = false;
	await sequelize.query(
		'INSERT INTO users (username, full_name, email, phone, shipping_address, password, es_admin ) values (?,?,?,?,?,?,?)',
		{
			replacements: [username, full_name, email, phone, shipping_address, password, es_admin],
		}
	);
	const response = await sequelize.query('SELECT * FROM users WHERE user_id=(SELECT max(user_id) FROM users)', {
		type: sequelize.QueryTypes.SELECT,
	});
	res.status(201).json({ ok: true, message: 'User created successfully', data: response[0] });
}

async function jwtGeneration(req, res) {
	const userData = req.body;
	const token = jwt.sign(userData, key);
	return res.status(200).json({ ok: true, token: token, message: 'Logged successfully' });
}

async function getAllUsers(req, res) {
	const response = await sequelize.query('SELECT * FROM users', { type: sequelize.QueryTypes.SELECT });
	res.status(200).json({ ok: true, message: 'Successful request', data: response });
}

async function getUser(req, res) {
	const user_id = await req.params.id;
	const response = await sequelize.query('SELECT * FROM users WHERE user_id = ?', {
		replacements: [user_id],
		type: sequelize.QueryTypes.SELECT,
	});
	res.status(200).json({ ok: true, message: 'Successful request', data: response[0] });
}

async function editUser(req, res) {
	try {
		const user_id = await req.params.id;

		const { username, full_name, email, phone, shipping_address, password, es_admin } = await req.body;

		const response = await sequelize.query('SELECT * FROM users WHERE user_id = ?', {
			replacements: [user_id],
			type: sequelize.QueryTypes.SELECT,
		});

		if (username || full_name || email || phone || shipping_address || password || es_admin) {
			Object.assign(response[0], req.body);

			const { username, full_name, email, phone, shipping_address, password, es_admin } = response[0];

			await sequelize.query(
				`UPDATE users SET username = ?, full_name = ?, email = ?, phone = ?, 
				shipping_address = ?, password = ?, es_admin = ? WHERE user_id = ?`,
				{ replacements: [username, full_name, email, phone, shipping_address, password, es_admin, user_id] }
			);

			res.status(200).json({ ok: true, message: 'Successful request', data: response[0] });
		} else throw new Error('Error, missing data');
	} catch (e) {
		res.status(400).json({ ok: false, message: e.message });
	}
}

async function deleteUser(req, res) {
	const user_id = await req.params.id;
	const order_id = await sequelize.query('SELECT order_id FROM orders WHERE  user_id= ? ', {
		replacements: [user_id],
		type: sequelize.QueryTypes.SELECT,
	});
	order_id.forEach(async (order) => {
		await sequelize.query('DELETE FROM orders_products WHERE order_id = ?', { replacements: [order.order_id] });
	});
	await sequelize.query('DELETE FROM orders WHERE user_id = ?', { replacements: [user_id] });
	await sequelize.query('DELETE FROM users WHERE user_id = ?', { replacements: [user_id] });

	res.status(200).json({ ok: true, message: 'User deleted' });
}

module.exports = { createUser, jwtGeneration, getAllUsers, getUser, editUser, deleteUser };