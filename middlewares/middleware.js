const {sequelize} = require('../DATABASE/datab');
const {key} = require('../configurations/configurations');
/*const jwt = require('jsonwebtoken');*/


async function dataValidate(req, res, next) {
	try {
		if (req.path == '/register') {
			console.log('im here');
			const { username, full_name, email, phone, shipping_address, password } = await req.body;
			console.log("User Name:", req, username);
			console.log(username);
			console.log(full_name);
			console.log(email);
			console.log(phone);
			console.log(shipping_address);
			console.log(password);


			if (username && full_name && email && phone && shipping_address && password) {
				const response = await sequelize.query('SELECT users.email, users.username FROM users', {
					type: sequelize.QueryTypes.SELECT,
				});

				const userRepeated = response.find((user) => user.email == email || user.username == username);

				if (userRepeated !== undefined) throw new Error('Error, Previously registered user');
				else return next();
			} else throw new Error('Error, missing data   dataValidate ');
		} 

		if (req.path == '/products') {
			const { name, description, photo_url, price } = await req.body;

			if (name && description && photo_url && price) {
				const response = await sequelize.query('SELECT products.name, products.description FROM products', {
					type: sequelize.QueryTypes.SELECT,
				});

				const productRepeated = response.find((product) => product.name == name || product.description == description);

				if (productRepeated !== undefined) throw new Error('Error, Previously registered product');
				else return next();
			} else throw new Error('Error, missing data');
		}
	} catch (e) {
		if (e.message === 'Error, missing data') return res.status(400).json({ ok: false, message: e.message });
		else return res.status(409).json({ ok: false, message: e.message });
	}
}
async function userDataValid(req, res, next) {
	try {
		const { username, email } = await req.body;

		const response = await sequelize.query('SELECT users.email, users.username FROM users', {
			type: sequelize.QueryTypes.SELECT,
		});

		const userRepeated = response.find((user) => user.email == email || user.username == username);

		if (userRepeated !== undefined) throw new Error('Error, Previously registered user');
		else return next();
	} catch (e) {
		if (e.message === 'Error, missing data') return res.status(400).json({ ok: false, message: e.message });
		else return res.status(409).json({ ok: false, message: e.message });
	}
}
async function userRegisterValidate(req, res, next) {
	try {
		const { username, password } = await req.body;
		const responseData = await sequelize.query("SELECT username, password FROM users where username="+username+" && password="+password+";", {
			type: sequelize.QueryTypes.SELECT,
		});

		const registered = responseData.find((user) => user.username == username && user.password == password);

		if (registered !== undefined) return next();
		else throw new Error('Error, Incorrect credentialsfsdtretrewtwert');
	} catch (e) {
		return res.status(401).json({ ok: false, message: e.message });
	}
}
/*async function jwtValidate(req, res, next) {
	console.log('PRUEBAJWTVALIDATE');
	try {
		if (req.path !== '/register' && req.path !== '/login') {
			const token = req.headers.authorization.split(' ')[1];
			console.log(token);
			const verifyToken = jwt.verify(token, key);

			if (verifyToken) {
				req.token = verifyToken;
				return next();
			}
		} else return next();
	} catch (e) {
		return res.status(401).json({ ok: false, message: 'Error, Invalid Token, PRUEBAJWTVALIDATE' });
	}
}*/

/*async function adminValidate(req, res, next) {
	try {
		// This dataUser arrives from jwtValidation() 
		const dataUser = req.token.username;
		const adminData = await sequelize.query('SELECT users.es_admin FROM users WHERE  username= ? ', {
			replacements: [dataUser],
			type: sequelize.QueryTypes.SELECT,
		});

		if (adminData[0].es_admin == 1) next();
		else throw new Error('Error, only an admin user can do this');
	} catch (e) {
		if (e.message === 'Error, only an admin user can do this')
			return res.status(403).json({ ok: false, message: e.message });
		return res
			.status(409)
			.json({ ok: false, message: 'Error, you cannot perform this action because you aren´t registered' });
	}
}*/

async function idProductValidate(req, res, next) {
	try {
		const product_id = req.params.id;
		const response = await sequelize.query('SELECT product_id FROM products', { type: sequelize.QueryTypes.SELECT });
		const exist = response.find((id) => id.product_id == product_id);

		if (exist) return next();
		else throw new Error('Error, not found');
	} catch (e) {
		return res.status(404).json({ ok: false, message: e.message });
	}
}

async function idUserValidate(req, res, next) {
	try {
		const user_id = await req.params.id;
		console.log(req.params,'PRUEBA DE DATA VALIDATE');
		const response = await sequelize.query('SELECT id FROM users', { type: sequelize.QueryTypes.SELECT });
		const exist = response.find((id) => id.id == user_id);
		console.log(exist);


		if (exist) return next();
		else throw new Error('Error, not found');
	} catch (e) {
		return res.status(404).json({ ok: false, message: e.message });
	}
}

async function dataOrderValidate(req, res, next) {
	try {
		const { payment_method, info_order } = req.body;

		if (payment_method && info_order) {
			if (payment_method == 'cash' || payment_method == 'card') {
				info_order.forEach((order) => {
					if (!order.product_id || !order.quantity) throw new Error('Error, missing data');
				});
				return next();
			} else throw new Error('Error, invalid payment method');
		} else throw new Error('Error, missing data');
	} catch (e) {
		if (e.message === 'Error, missing data') return res.status(400).json({ ok: false, message: e.message });
		else return res.status(403).json({ ok: false, message: e.message });
	}
}

async function orderStatusValidate(req, res, next) {
	try {
		const { status } = req.body;

		if (status) {
			if (
				status == 'confirmed' ||
				status == 'preparing' ||
				status == 'sending' ||
				status == 'cancelled' ||
				status == 'delivered' ||
				status == 'new'
			)
				next();
			else throw new Error('Error, Input invalid');
		} else throw new Error('Error, Input invalid');
	} catch (e) {
		res.status(400).json({ ok: false, message: e.message });
	}
}

async function error(err, req, res, next) {
	if (!err) return next();
	res.status(500).send('Error, something was wrong');
}

module.exports = {
	dataValidate,
	userDataValid,
	userRegisterValidate,
	//jwtValidate,
	//adminValidate,
	idProductValidate,
	idUserValidate,
	dataOrderValidate,
	orderStatusValidate,
	error,
};




