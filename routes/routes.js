const express = require('express');
const router = express.Router();


const {middle} = require('../middlewares');
const {productsController, usersController, ordersController} = require('./controllers');

//WHATEVER USER//
router.get('/', (req, res)=>res.send('hi all'));
router.get('/products', productsController.getAllProducts);
router.get('/products/:id', middle.idProductValidate, productsController.getProduct);
router.post('/register', middle.dataValidate, usersController.createUser);
router.post('/login', middle.userRegisterValidate, usersController.jwtGeneration);
router.post('/orders', middle.dataOrderValidate, ordersController.createOrder);

//IN THIS PART ONLY ADMIN USER//
router.post (
    '/products',
    middle.adminValidate,
    middle.dataValidate,
	productsController.createProduct
);
router.put (
    '/products/:id',
    middle.adminValidate,
	middle.idProductValidate,
	productsController.editProduct
);
router.delete (
    '/products/:id',
    middle.adminValidate,
	middle.idProductValidate,
	productsController.deleteProduct
);
router.get('/users', middle.adminValidate, usersController.getAllUsers);
router.get('/users/:id', middle.idUserValidate, middle.adminValidate, usersController.getUser); 
router.put(
    '/users/:id',
    middle.idUserValidate,
    middle.userDataValid,
	middle.adminValidate,
	usersController.editUser
);
router.delete (
    '/users/:id',
	middle.idUserValidate,
	middle.adminValidate,
	usersController.deleteUser
);
router.get('/orders', middle.adminValidate, ordersController.getAllOrders);
router.get('/orders/:id', ordersController.getOrder);
router.put (
    '/orders/:id',
    middle.orderStatusValidate,
	middle.adminValidate,
	ordersController.editOrder
);
router.delete('/orders/:id', middle.adminValidate, ordersController.deleteOrder);


module.exports = router;