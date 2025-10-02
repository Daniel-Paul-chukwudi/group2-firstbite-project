const cartModel = require('../models/cartModel')
const userModel = require('../models/userModel')

const { createOrder, getAllOrders, getOneOrder, getOrdersByUser } = require('../controllers/orderController')

const router = require('express').Router();


router.post('/create', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOneOrder);
router.get('/user/:userId', getOrdersByUser);

module.exports = router;