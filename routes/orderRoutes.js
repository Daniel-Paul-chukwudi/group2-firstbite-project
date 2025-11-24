const cartModel = require('../models/cartModel')
const userModel = require('../models/userModel')

const { createOrder, getAllOrders, getOneOrder, getOrdersByUser,reOrder,orderRating,orderSummary } = require('../controllers/orderController')

const router = require('express').Router();

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order using the items in the user's cart and clears the cart after order creation.
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user placing the order
 *                 example: "64fae123abc4567890def123"
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Your order has been placed successfully."
 *                 data:
 *                   type: object
 *                   description: The newly created order
 *       400:
 *         description: Bad request (missing userId or empty cart)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User ID is required for order creation."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "<error message>"
 */
router.post('/create', createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retrieve all orders
 *     description: Fetches all orders in the database. Useful for admin dashboards or analytics.
 *     tags:
 *       - Orders
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Find all orders below"
 *                 data:
 *                   type: array
 *                   description: Array of orders
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64fbc123abc4567890def456"
 *                       userId:
 *                         type: string
 *                         example: "64fae123abc4567890def123"
 *                       goods:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             productId:
 *                               type: string
 *                               example: "64fcf123abc4567890def789"
 *                             productName:
 *                               type: string
 *                               example: "Smartphone"
 *                             price:
 *                               type: number
 *                               example: 150000
 *                             quantity:
 *                               type: number
 *                               example: 2
 *                             productImage:
 *                               type: string
 *                               example: "https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg"
 *                       totalAmount:
 *                         type: number
 *                         example: 300000
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-11-24T13:22:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-11-24T13:22:00Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "<error message>"
 */
router.get('/orders', getAllOrders);

/**
 * @swagger
 * /order/{id}:
 *   get:
 *     summary: Retrieve a single order
 *     description: Fetch a specific order by its ID.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the order to retrieve
 *     responses:
 *       200:
 *         description: Order found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Find order below"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64fbc123abc4567890def456"
 *                     userId:
 *                       type: string
 *                       example: "64fae123abc4567890def123"
 *                     goods:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             example: "64fcf123abc4567890def789"
 *                           productName:
 *                             type: string
 *                             example: "Smartphone"
 *                           price:
 *                             type: number
 *                             example: 150000
 *                           quantity:
 *                             type: number
 *                             example: 2
 *                           productImage:
 *                             type: string
 *                             example: "https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg"
 *                     totalAmount:
 *                       type: number
 *                       example: 300000
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-24T13:22:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-24T13:22:00Z"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order not found"
 *                 data:
 *                   type: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "<error message>"
 */
router.get('/order/:id', getOneOrder);

/**
 * @swagger
 * /order/user/{userId}:
 *   get:
 *     summary: Retrieve all orders for a specific user
 *     description: Fetch all orders placed by a user using their userId.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose orders are to be retrieved
 *     responses:
 *       200:
 *         description: Orders found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Find all orders for this user below"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64fbc123abc4567890def456"
 *                       userId:
 *                         type: string
 *                         example: "64fae123abc4567890def123"
 *                       goods:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             productId:
 *                               type: string
 *                               example: "64fcf123abc4567890def789"
 *                             productName:
 *                               type: string
 *                               example: "Smartphone"
 *                             price:
 *                               type: number
 *                               example: 150000
 *                             quantity:
 *                               type: number
 *                               example: 2
 *                             productImage:
 *                               type: string
 *                               example: "https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg"
 *                       totalAmount:
 *                         type: number
 *                         example: 300000
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-11-24T13:22:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-11-24T13:22:00Z"
 *       404:
 *         description: No order found for this user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No order found for this user"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "<error message>"
 */
router.get('/order/user/:userId', getOrdersByUser);

/**
 * @swagger
 * /reorder/{orderId}:
 *   post:
 *     summary: Reorder items from a previous order
 *     description: Adds items from a previous order to the user's cart for re-purchase.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to reorder
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user placing the reorder
 *                 example: "64fae123abc4567890def123"
 *     responses:
 *       200:
 *         description: Reorder successful, items added to cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reorder is successful, items from order 12345 added to your cart."
 *                 cart:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     goods:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                           quantity:
 *                             type: number
 *                     totalPrice:
 *                       type: number
 *       400:
 *         description: Missing parameters or empty reorder
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User id and order id are required for reorder"
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied, you can only reorder your own purchases"
 *       404:
 *         description: Original order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Initial order not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "<error message>"
 */
router.post('/reorder/:orderId', reOrder);

/**
 * @swagger
 * /rate/{orderId}:
 *   put:
 *     summary: Rate an order
 *     description: Allows a user to rate an order they have placed with a rating between 1 and 5.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to rate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user rating the order
 *                 example: "64fae123abc4567890def123"
 *               rating:
 *                 type: number
 *                 description: Rating value from 1 to 5
 *                 example: 4
 *     responses:
 *       200:
 *         description: Order rated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order 12345 rated successfully with 4 stars."
 *                 data:
 *                   type: object
 *                   properties:
 *                     orderId:
 *                       type: string
 *                     rating:
 *                       type: number
 *       400:
 *         description: Missing or invalid parameters, or order already rated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A valid userId, orderId, and a rating (1-5) are required"
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied, you can only rate your own orders"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "<error message>"
 */
router.put('/rate/:orderId', orderRating);

/**
 * @swagger
 * /summary/{orderId}:
 *   get:
 *     summary: Get order summary
 *     description: Retrieves the details of an order along with user delivery address and phone number.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to retrieve summary for
 *     responses:
 *       200:
 *         description: Order summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Find the order summary below"
 *                 data:
 *                   type: object
 *                   description: Order object with populated product details
 *                 userAddress:
 *                   type: string
 *                   example: "123 Main Street, Lagos"
 *                 phoneNumber:
 *                   type: string
 *                   example: "+2348012345678"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "<error message>"
 */
router.get('/summary/:orderId', orderSummary);

module.exports = router;