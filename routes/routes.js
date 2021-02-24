const express = require('express');
const router = express.Router();



const {middle} = require('../middlewares');
const {productsController, usersController, ordersController} = require('../controllers');

//CUALQUIER USUARIO//
router.get('/', (req, res)=>res.send('hi all'));
router.get('/products', productsController.obtainAllProducts);
router.get('/products/:id', middle.idProductValidation, productsController.obtainProduct);
router.post('/register', middle.dataValidation, usersController.newUser);
router.post('/login', middle.userRegisterValidation, usersController.tokenGeneration);
router.post('/orders', middle.dataOrderValidation, ordersController.newOrder);

//SOLO USUARIO ADMINISTRADOR//
router.post (
    '/products',
    middle.adminValidation,
    middle.dataValidation,
	productsController.newProduct
);
router.put (
    '/products/:id',
    middle.adminValidation,
	middle.idProductValidation,
	productsController.modifyProduct
);
router.delete (
    '/products/:id',
    middle.adminValidation,
	middle.idProductValidation,
	productsController.deleteProduct
);
router.get('/users', middle.adminValidation, usersController.obtainAllUsers);
router.get('/users/:id', middle.idUserValidation, middle.adminValidation, usersController.obtainUser);
router.put('/users/:id',middle.idUserValidation,middle.userDataValidation, middle.adminValidation,
usersController.modifyUser
);
router.delete (
    '/users/:id',
	middle.idUserValidation,
	middle.adminValidation,
	usersController.deleteUser
);
router.get('/orders',middle.adminValidation, ordersController.obtainAllOrders);
router.get('/orders/:id', ordersController.obtainOrder);
router.put (
    '/orders/:id',
    middle.orderStatusValidation,
	middle.adminValidation,
	ordersController.modifyOrder
);
router.delete('/orders/:id', middle.adminValidation, ordersController.deleteOrder);


module.exports = router;