const { initializePayment, verifyPayment } = require('../controllers/paymentController');

const router = require('express').Router();

/**
 * @swagger
 * /make-payment/{userId}/{productId}:
 *   get:
 *     summary: Initialize payment for a product
 *     description: Initializes a payment transaction for a user purchasing a specific product.
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user making the payment
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product being purchased
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       example: "abc123XYZ456"
 *                     checkout_url:
 *                       type: string
 *                       example: "https://checkout.korapay.com/xyz123"
 *       404:
 *         description: User or product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 */
router.get('/make-payment/:userId/:productId', initializePayment);

/**
 * @swagger
 * /verify-payment:
 *   get:
 *     summary: Verify payment status
 *     description: Checks the status of a payment using the payment reference and updates it in the database.
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: query
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: The payment reference to verify
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment successful
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment not found
 */
router.get('/verify-payment', verifyPayment);

module.exports = router;